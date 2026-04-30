import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { db, lessonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUser } from "../middlewares/auth";

const router: IRouter = Router();

const anthropic = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ?? "placeholder",
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type QuizQuestion = { question: string; options: string[]; answerIndex: number; explanation?: string };

router.post("/lessons/:id/quiz", requireUser, async (req, res) => {
  try {
    const id = req.params.id;
    if (!UUID_RE.test(id)) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }
    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id)).limit(1);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    const avoidRaw: unknown = req.body?.avoid;
    const avoid: string[] = (Array.isArray(avoidRaw) ? avoidRaw : [])
      .filter((s): s is string => typeof s === "string")
      .map((s) => s.replace(/[\r\n`]+/g, " ").trim().slice(0, 200))
      .filter((s) => s.length > 0)
      .slice(0, 20);
    const lang: string = typeof req.body?.lang === "string" && /^[a-z]{2}$/.test(req.body.lang) ? req.body.lang : "en";
    const seed = Math.floor(Math.random() * 100000);

    const langName: Record<string, string> = {
      en: "English",
      fr: "French",
      zh: "Simplified Chinese",
      sn: "Shona (Zimbabwean)",
      nd: "Ndebele (Zimbabwean)",
    };

    const prompt = `You are creating a fun quiz for a young Early Childhood Development (ECD) learner aged 3-6 in Zimbabwe.

Lesson title: ${lesson.title}
Class level: ${lesson.classLevel}
Subject: ${lesson.subject}
Description: ${lesson.description}
${lesson.content ? `\nLesson content:\n${lesson.content}` : ""}

Create EXACTLY 10 quiz questions about this lesson. Rules:
- Use simple, friendly language a 3-6 year old can understand
- Each question must be very short (max 12 words)
- Provide exactly 3 multiple-choice options per question
- Mark the correct one via answerIndex (0, 1 or 2)
- Add a one-sentence kid-friendly explanation
- Output ALL text in ${langName[lang] ?? "English"}
- Make all 10 questions cover different ideas from the lesson (no repeats)
- Variation seed: ${seed} (make these questions different from previous ones)
${avoid.length ? `- AVOID repeating these previously asked question stems: ${avoid.map((q) => `"${q}"`).join(", ")}` : ""}

Respond ONLY with valid JSON in this exact shape, no prose:
{ "questions": [ { "question": "...", "options": ["A","B","C"], "answerIndex": 0, "explanation": "..." } ] }`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      res.status(502).json({ message: "Empty AI response" });
      return;
    }
    let raw = textBlock.text.trim();
    const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) raw = fence[1].trim();

    let parsed: { questions: QuizQuestion[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("no JSON");
      parsed = JSON.parse(raw.slice(start, end + 1));
    }

    const avoidSet = new Set(avoid.map((s) => s.toLowerCase().trim()));
    const seen = new Set<string>();
    const questions = (parsed.questions || [])
      .filter((q) => q && typeof q.question === "string" && Array.isArray(q.options) && q.options.length >= 2)
      .map((q) => {
        const options = q.options.filter((o): o is string => typeof o === "string").slice(0, 4);
        const rawIdx = Number(q.answerIndex);
        const answerIndex = Number.isFinite(rawIdx) ? Math.max(0, Math.min(options.length - 1, Math.floor(rawIdx))) : 0;
        return {
          question: String(q.question).trim(),
          options,
          answerIndex,
          explanation: typeof q.explanation === "string" ? q.explanation : "",
        };
      })
      .filter((q) => q.options.length >= 2 && q.question.length > 0)
      .filter((q) => {
        const key = q.question.toLowerCase();
        if (avoidSet.has(key) || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10);

    if (questions.length === 0) {
      res.status(502).json({ message: "Quiz generation failed" });
      return;
    }

    res.json({ questions });
  } catch (err) {
    req.log?.error?.({ err }, "quiz generation failed");
    res.status(500).json({ message: "Quiz generation failed" });
  }
});

export default router;
