export function ElectrochemistryQuizGate({
  question,
  options,
  onAnswer,
  feedback,
}: {
  question: string;
  options: Array<{ id: string; label: string }>;
  onAnswer: (id: string) => void;
  feedback?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-lg">
      <h3 className="text-lg font-black text-slate-950">{question}</h3>
      <div className="mt-3 grid gap-2">
        {options.map((option) => (
          <button key={option.id} type="button" className="rounded-2xl bg-blue-50 px-4 py-3 text-left text-sm font-black text-blue-900 hover:bg-blue-100" onClick={() => onAnswer(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      {feedback ? <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">{feedback}</p> : null}
    </div>
  );
}
