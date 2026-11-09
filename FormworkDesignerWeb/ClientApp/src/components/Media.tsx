import { useEffect, useRef, useState } from "react";
export function Media({
  name,
  title,
  eager = false,
}: {
  name: string;
  title: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setNear(true);
        else element.pause();
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="media-window">
      {missing ? (
        <div className="media-fallback">
          <span>FormworkDesigner</span>
          <p>{title}</p>
          <small>Демонстрация временно недоступна</small>
        </div>
      ) : (
        <video
          ref={ref}
          src={near ? `/media/${name}.mp4` : undefined}
          poster={`/media/${name}.jpg`}
          controls
          muted
          loop
          playsInline
          preload="none"
          aria-label={title}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
