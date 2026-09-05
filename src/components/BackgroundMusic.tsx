import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLDivElement, options: YTPlayerOptions) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
    __ytBackgroundMusicApiPromise?: Promise<void>;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
};

type YTPlayerOptions = {
  videoId: string;
  width: string;
  height: string;
  playerVars: Record<string, string | number | boolean>;
  events: {
    onReady?: (event: { target: YTPlayer }) => void;
  };
};

const VIDEO_ID = "Nvz0Too3hv4";
const START_SECONDS = 57;

function loadYouTubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (!window.__ytBackgroundMusicApiPromise) {
    window.__ytBackgroundMusicApiPromise = new Promise<void>((resolve) => {
      const existing = document.getElementById("yt-iframe-api");
      if (existing) {
        window.onYouTubeIframeAPIReady = () => resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => resolve();
    });
  }

  return window.__ytBackgroundMusicApiPromise;
}

export default function BackgroundMusic() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let disposed = false;

    const start = async () => {
      await loadYouTubeApi();
      if (disposed || !hostRef.current || playerRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: VIDEO_ID,
        width: "1",
        height: "1",
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: START_SECONDS,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: ({ target }) => {
            target.mute();
            target.playVideo();
          },
        },
      });
    };

    void start();

    const unmuteOnGesture = () => {
      playerRef.current?.unMute();
      playerRef.current?.playVideo();
    };

    window.addEventListener("pointerdown", unmuteOnGesture, { once: true, passive: true });
    window.addEventListener("touchstart", unmuteOnGesture, { once: true, passive: true });
    window.addEventListener("keydown", unmuteOnGesture, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("pointerdown", unmuteOnGesture);
      window.removeEventListener("touchstart", unmuteOnGesture);
      window.removeEventListener("keydown", unmuteOnGesture);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed -left-px -top-px h-px w-px overflow-hidden opacity-0" />;
}
