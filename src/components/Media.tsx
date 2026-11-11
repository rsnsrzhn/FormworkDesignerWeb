import { useEffect, useRef, useState } from 'react';
export function Media({
  name,
  title,
  eager = false,
  autoPlay = false,
}: {
  name: string;
  title: string;
  eager?: boolean;
  autoPlay?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          if (autoPlay && element.currentSrc)
            void element.play().catch(() => {});
        } else element.pause();
      },
      {
        rootMargin: autoPlay ? '0px' : '200px',
        threshold: autoPlay ? 0.15 : 0,
      },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.pause();
    };
  }, [autoPlay]);
  useEffect(() => {
    const element = ref.current;
    if (element && near && autoPlay) {
      element.muted = true;
      void element.play().catch(() => {});
    }
  }, [near, autoPlay]);
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
          autoPlay={autoPlay}
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
