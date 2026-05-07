import { QuizFlow } from "@/components/guide/quiz-flow";

export const metadata = {
  title: "Квиз Road Ready",
  description:
    "Квиз из 10 вопросов по ПДД КР, горному вождению и поведению в ЧС. Сдайте, чтобы получить бейдж Road Ready.",
};

export default function QuizPage() {
  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <QuizFlow />
      </div>
    </div>
  );
}
