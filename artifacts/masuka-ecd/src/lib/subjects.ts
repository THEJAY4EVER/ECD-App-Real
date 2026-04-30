export const SUBJECT_META: Record<string, { color: string; emoji: string; bg: string }> = {
  Mathematics: { color: "#1f7a3a", emoji: "🔢", bg: "from-emerald-200 to-green-100" },
  English: { color: "#0f766e", emoji: "📚", bg: "from-teal-200 to-cyan-100" },
  Literacy: { color: "#0f766e", emoji: "📚", bg: "from-teal-200 to-cyan-100" },
  Shona: { color: "#d4a017", emoji: "🇿🇼", bg: "from-amber-200 to-yellow-100" },
  Ndebele: { color: "#b45309", emoji: "🦁", bg: "from-orange-200 to-amber-100" },
  French: { color: "#1e40af", emoji: "🇫🇷", bg: "from-blue-200 to-indigo-100" },
  Chinese: { color: "#b91c1c", emoji: "🇨🇳", bg: "from-red-200 to-rose-100" },
  "Environmental Science": { color: "#3b9ea8", emoji: "🌱", bg: "from-teal-200 to-cyan-100" },
  "Visual & Performing Arts": { color: "#c2487a", emoji: "🎨", bg: "from-pink-200 to-rose-100" },
  "Creative Arts": { color: "#c2487a", emoji: "🎨", bg: "from-pink-200 to-rose-100" },
  "Heritage Studies": { color: "#7a5fbf", emoji: "🏛️", bg: "from-violet-200 to-purple-100" },
  "Physical Education": { color: "#7a5fbf", emoji: "🏃", bg: "from-violet-200 to-purple-100" },
};

export function subjectMeta(name: string) {
  return SUBJECT_META[name] ?? { color: "#888", emoji: "✨", bg: "from-slate-200 to-slate-100" };
}

import { useI18n } from "@/lib/i18n";

export function gradeColor(grade?: string | null) {
  switch (grade) {
    case "excellent": return "bg-emerald-500 text-white";
    case "good": return "bg-sky-500 text-white";
    case "developing": return "bg-amber-500 text-white";
    case "needs_support": return "bg-rose-500 text-white";
    default: return "bg-slate-300 text-slate-700";
  }
}

export function gradeLabel(grade?: string | null) {
  switch (grade) {
    case "excellent": return "Excellent";
    case "good": return "Good";
    case "developing": return "Developing";
    case "needs_support": return "Needs support";
    default: return "Pending";
  }
}

export function useGradeLabel() {
  const { t } = useI18n();
  return (grade?: string | null) => (grade ? t(`grade.${grade}`) : t("common.pending"));
}
