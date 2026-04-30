import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RotateCcw, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

type Question = { question: string; options: string[]; answerIndex: number; explanation?: string };

export function Quiz({ lessonId }: { lessonId: string }) {
  const { t, lang } = useI18n();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function recentSeen(): string[] {
    try {
      return JSON.parse(localStorage.getItem(`quiz.seen.${lessonId}`) || "[]");
    } catch {
      return [];
    }
  }

  function rememberSeen(qs: Question[]) {
    const seen = [...recentSeen(), ...qs.map((q) => q.question)].slice(-30);
    localStorage.setItem(`quiz.seen.${lessonId}`, JSON.stringify(seen));
  }

  async function start() {
    setLoading(true);
    setError(null);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    try {
      const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      const res = await fetch(`${base}/api/lessons/${lessonId}/quiz`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avoid: recentSeen(), lang }),
      });
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      if (!data.questions?.length) throw new Error("empty");
      setQuestions(data.questions);
      rememberSeen(data.questions);
    } catch {
      setError(t("quiz.error"));
    } finally {
      setLoading(false);
    }
  }

  function pick(i: number) {
    if (picked !== null || !questions) return;
    setPicked(i);
    if (i === questions[idx].answerIndex) setScore((s) => s + 1);
  }

  function next() {
    if (!questions) return;
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  if (!questions && !loading) {
    return (
      <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-violet-50 to-pink-50">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">{t("quiz.title")}</span>
        </div>
        <p className="text-sm text-foreground/80 mb-3">{t("quiz.intro")}</p>
        {error && <p className="text-xs text-rose-600 mb-2">{error}</p>}
        <Button onClick={start} className="font-bold" data-testid="button-start-quiz">
          <Sparkles className="w-4 h-4 mr-1" /> {t("quiz.start")}
        </Button>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-violet-50 to-pink-50 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 animate-spin" />
          <span className="text-sm font-bold text-violet-700">{t("quiz.generating")}</span>
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  if (done && questions) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <Card className="p-6 text-center border-0 bg-gradient-to-br from-amber-100 to-emerald-100">
          <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.6 }}>
            <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-2" />
          </motion.div>
          <div className="text-2xl font-extrabold text-primary">{t("quiz.complete")}</div>
          <div className="text-lg mt-1 mb-4">{t("quiz.scored")} {score} / {questions.length}</div>
          <Button onClick={start} className="font-bold" data-testid="button-quiz-again">
            <RotateCcw className="w-4 h-4 mr-1" /> {t("quiz.newQuiz")}
          </Button>
        </Card>
      </motion.div>
    );
  }

  const q = questions![idx];
  const correct = picked !== null && picked === q.answerIndex;
  const wrong = picked !== null && picked !== q.answerIndex;

  return (
    <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-violet-50 to-pink-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-violet-700">{t("quiz.title")} · {idx + 1}/{questions!.length}</span>
        <span className="text-xs text-muted-foreground">{t("games.score")}: {score}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-base font-bold mb-3" data-testid="text-question">{q.question}</div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const showCorrect = picked !== null && i === q.answerIndex;
              const showWrong = picked === i && i !== q.answerIndex;
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`w-full text-left p-3 rounded-xl font-medium border-2 transition-colors flex items-center justify-between ${
                    showCorrect
                      ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                      : showWrong
                      ? "bg-rose-100 border-rose-400 text-rose-900"
                      : picked !== null
                      ? "bg-muted/40 border-transparent opacity-60"
                      : "bg-white border-violet-200 hover:border-violet-400 hover:bg-violet-50"
                  }`}
                  data-testid={`option-${i}`}
                >
                  <span>{opt}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {showWrong && <XCircle className="w-5 h-5 text-rose-600" />}
                </motion.button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
              <div className={`text-sm font-bold mb-1 ${correct ? "text-emerald-700" : "text-rose-700"}`}>
                {correct ? "🎉 " + t("quiz.correct") : "💡 " + t("quiz.tryAgain")}
              </div>
              {q.explanation && <div className="text-xs text-foreground/70">{q.explanation}</div>}
              <Button onClick={next} className="mt-3 font-bold" data-testid="button-next-question">
                {idx + 1 >= questions!.length ? t("quiz.finish") : t("quiz.next")}
              </Button>
            </motion.div>
          )}
          {wrong && false}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
