import { useEffect, useState } from "react";
import { getAllGameAssets } from "@/lib/gameAssets";
import { preloadAssets } from "@/lib/assetPreloader";

interface GlobalAssetLoaderProps {
  children: React.ReactNode;
}

export const GlobalAssetLoader = ({ children }: GlobalAssetLoaderProps) => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const assets = getAllGameAssets();

    preloadAssets({
      ...assets,
      concurrency: 6,
      timeoutMs: 30000,
      onProgress: ({ loaded, total }) => {
        if (!cancelled) setProgress(total ? loaded / total : 1);
      },
    }).finally(() => {
      if (!cancelled) {
        setProgress(1);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (ready) return <>{children}</>;

  const pct = Math.max(3, Math.min(100, Math.round(progress * 100)));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 text-lg font-black tracking-[0.28em] text-primary">
          Loading
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-amber-300 to-teal-300 transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 text-xs font-bold text-muted-foreground">{pct}%</div>
      </div>
    </div>
  );
};
