import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ExplanationBox } from "@/components/quiz/ExplanationBox";
import type { scoreQuiz } from "@/lib/quiz/scoring";

type QuizScore = ReturnType<typeof scoreQuiz>;

export function QuizResult({ result }: { result: QuizScore }) {
  return (
    <div className="space-y-5">
      <Card className="glass-panel-strong">
        <Badge tone={result.percentage >= 70 ? "green" : "amber"}>Quiz complete</Badge>
        <h2 className="mt-4 text-3xl font-black text-slate-950">
          {result.score}/{result.total} correct
        </h2>
        <p className="mt-2 font-semibold text-slate-600">{result.percentage}% mastery signal for this attempt.</p>
      </Card>
      {result.results.map((item, index) => (
        <Card key={item.question.id}>
          <div className="flex items-start gap-3">
            {item.correct ? (
              <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" aria-hidden="true" />
            ) : (
              <XCircle className="mt-1 h-5 w-5 text-rose-300" aria-hidden="true" />
            )}
            <div>
              <p className="text-sm font-bold text-slate-500">Question {index + 1}</p>
              <h3 className="mt-1 font-black text-slate-950">{item.question.questionText}</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Your answer: <span className="font-black text-slate-950">{item.answer || "No answer"}</span>
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Correct answer: <span className="font-black text-slate-950">{String(item.question.correctAnswer)}</span>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ExplanationBox explanation={item.question.explanation} />
          </div>
        </Card>
      ))}
    </div>
  );
}
