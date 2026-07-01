"use client";

export function GasVolumePuzzle() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {["1 volume N2", "3 volumes H2", "2 volumes NH3"].map((label, index) => (
        <div
          key={label}
          className={`rounded-[1.5rem] border p-4 text-center text-sm font-black shadow-sm ${
            index === 0 ? "border-blue-200 bg-blue-50 text-blue-900" : index === 1 ? "border-violet-200 bg-violet-50 text-violet-900" : "border-green-200 bg-green-50 text-green-900"
          }`}
        >
          <div className="mx-auto mb-3 h-20 w-16 rounded-b-2xl rounded-t-md border-2 border-current bg-white/70" />
          {label}
        </div>
      ))}
    </div>
  );
}
