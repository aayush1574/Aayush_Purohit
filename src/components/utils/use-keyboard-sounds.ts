import { useCallback, useEffect, useRef } from "react";

export const useKeyboardSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pressBufferRef = useRef<AudioBuffer | null>(null);
  const lastPressAtRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const AudioContextCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextCtor) return;

        const ctx = new AudioContextCtor();
        audioContextRef.current = ctx;

        const resp = await fetch("/assets/keycap-sounds/press.mp3");
        const buf = await ctx.decodeAudioData(await resp.arrayBuffer());
        if (cancelled) return;
        pressBufferRef.current = buf;
      } catch (error) {
        console.error("Failed to load keycap sound", error);
      }
    };

    init();

    const resume = () => {
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    };
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((ev) =>
      window.addEventListener(ev, resume, { once: false, passive: true })
    );

    return () => {
      cancelled = true;
      events.forEach((ev) => window.removeEventListener(ev, resume));
      audioContextRef.current?.close();
    };
  }, []);

  const playPressSound = useCallback(() => {
    const now = performance.now();
    if (now - lastPressAtRef.current < 80) return;
    lastPressAtRef.current = now;

    try {
      const ctx = audioContextRef.current;
      const buffer = pressBufferRef.current;
      if (!ctx || !buffer) return;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.detune.value = Math.random() * 200 - 100;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.4;

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { playPressSound };
};
