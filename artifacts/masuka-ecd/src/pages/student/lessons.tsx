import { useState } from "react";
import { Link } from "wouter";
import { useListLessons, useListSubjects } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { subjectMeta } from "@/lib/subjects";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function StudentLessons() {
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const subjectsQ = useListSubjects();
  const lessonsQ = useListLessons(subject ? { subject } : undefined);

  return (
    <Shell title="Lessons">
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2">
          <Button
            size="sm"
            variant={subject === undefined ? "default" : "outline"}
            onClick={() => setSubject(undefined)}
            data-testid="filter-all"
          >
            All
          </Button>
          {subjectsQ.data?.map((s) => {
            const m = subjectMeta(s.subject);
            return (
              <Button
                key={s.subject}
                size="sm"
                variant={subject === s.subject ? "default" : "outline"}
                onClick={() => setSubject(s.subject)}
                className="whitespace-nowrap"
                data-testid={`filter-${s.subject}`}
              >
                <span className="mr-1">{m.emoji}</span> {s.subject}
              </Button>
            );
          })}
        </div>

        {lessonsQ.isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0,1,2,3].map(i => <Skeleton key={i} className="aspect-video rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {lessonsQ.data?.map((l, idx) => {
              const m = subjectMeta(l.subject);
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, scale: 0.6, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: idx * 0.06 }}
                  whileHover={{ scale: 1.04, rotate: idx % 2 === 0 ? -1 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                <Link href={`/lessons/${l.id}`}>
                  <Card className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 ring-1 ring-transparent hover:ring-primary/30 transition-shadow" data-testid={`card-lesson-${l.id}`}>
                    <div className={cn("aspect-video relative bg-gradient-to-br", m.bg)}>
                      <img src={l.thumbnailUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {l.durationMinutes}m
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-semibold leading-tight line-clamp-2">{l.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <span>{m.emoji}</span> {l.classLevel}
                      </div>
                    </div>
                  </Card>
                </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}
