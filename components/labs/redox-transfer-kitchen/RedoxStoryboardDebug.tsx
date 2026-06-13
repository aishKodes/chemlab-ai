import { redoxAssetManifest } from "./redoxAssetManifest";
import { redoxStoryFrames } from "./redoxQuestData";

export function RedoxStoryboardDebug() {
  return (
    <div className="min-h-screen bg-[#071225] px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Development storyboard</p>
        <h1 className="mt-3 text-4xl font-black">Redox Transfer Kitchen Storyboard</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {redoxStoryFrames.map((frame, index) => {
            const asset = redoxAssetManifest[frame.assetRole];
            return (
              <article key={frame.id} className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 shadow-xl">
                <div className="relative aspect-video">
                  <img src={asset.src} alt={asset.label} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                      Scene {index + 1} · {frame.assetRole}
                    </p>
                    <h2 className="mt-1 text-xl font-black">{frame.speaker}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold leading-relaxed text-slate-100">{frame.text}</p>
                  <p className="mt-3 text-sm font-bold text-slate-400">
                    Motion: {frame.cameraMotion} · Overlay: {frame.overlay ?? "none"}
                  </p>
                  {frame.characterRoles?.length ? <p className="mt-2 text-sm text-cyan-100">Layered characters: {frame.characterRoles.join(", ")}</p> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
