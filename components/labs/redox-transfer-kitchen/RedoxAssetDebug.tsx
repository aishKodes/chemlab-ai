import { redoxAssetManifest, redoxAssetRoles } from "./redoxAssetManifest";

const previewBackgrounds = [
  { label: "white", className: "bg-white" },
  { label: "dark", className: "bg-slate-950" },
  { label: "blue", className: "bg-blue-700" },
  { label: "gradient", className: "bg-gradient-to-br from-amber-200 via-cyan-300 to-violet-500" },
];

export function RedoxAssetDebug() {
  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">Development asset audit</p>
        <h1 className="mt-3 text-4xl font-black">Redox Transfer Kitchen Assets</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Raw generated frames are mapped into semantic roles. Character cutouts had checkerboard backgrounds in the raw files, so live components use processed transparent PNG outputs.
        </p>
        <div className="mt-8 grid gap-5">
          {redoxAssetRoles.map((role) => {
            const asset = redoxAssetManifest[role];
            return (
              <article key={role} className="rounded-[2rem] border border-white/12 bg-white/8 p-4 shadow-xl">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="lg:w-72">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">{asset.usedIn}</p>
                    <h2 className="mt-2 text-xl font-black">{asset.label}</h2>
                    <p className="mt-1 break-all text-sm font-semibold text-cyan-100">{asset.role}</p>
                    <dl className="mt-4 grid gap-1 text-sm text-slate-300">
                      <div>Raw: {asset.rawFile}</div>
                      <div>
                        Size: {asset.width} x {asset.height}
                      </div>
                      <div>Transparency: {asset.hasAlpha ? "has alpha" : "no alpha in raw"}</div>
                      <div className={asset.checkerboardSuspected ? "font-black text-amber-200" : "text-lime-200"}>
                        {asset.checkerboardSuspected ? "Checkerboard suspected in raw; using processed output" : "No checkerboard warning"}
                      </div>
                    </dl>
                    <p className="mt-3 text-sm text-slate-300">{asset.note}</p>
                  </div>
                  <div className="grid flex-1 gap-3 md:grid-cols-4">
                    {previewBackgrounds.map((preview) => (
                      <div key={preview.label} className="overflow-hidden rounded-2xl border border-white/12 bg-slate-900">
                        <div className={`grid h-44 place-items-center ${preview.className}`}>
                          <img src={asset.src} alt={`${asset.label} on ${preview.label}`} className="max-h-full max-w-full object-contain" />
                        </div>
                        <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300">{preview.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
