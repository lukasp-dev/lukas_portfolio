import { useEffect, useRef } from "react";

// Shared mutable state — only one room is mounted at a time, so this is safe
export const joystick = { dx: 0, dy: 0 };

const JOYSTICK_R = 52;
const KNOB_R = 22;

const MobileJoystick = () => {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchId = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = baseRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (touchId.current !== null) return;
      const t = e.changedTouches[0];
      touchId.current = t.identifier;
      const rect = el.getBoundingClientRect();
      origin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const onMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier !== touchId.current) continue;
        const raw = { x: t.clientX - origin.current.x, y: t.clientY - origin.current.y };
        const dist = Math.sqrt(raw.x ** 2 + raw.y ** 2);
        const c = dist > JOYSTICK_R
          ? { x: raw.x / dist * JOYSTICK_R, y: raw.y / dist * JOYSTICK_R }
          : raw;
        joystick.dx = c.x / JOYSTICK_R;
        joystick.dy = c.y / JOYSTICK_R;
        if (knobRef.current) knobRef.current.style.transform = `translate(${c.x}px, ${c.y}px)`;
      }
    };

    const onEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId.current) {
          touchId.current = null;
          joystick.dx = 0;
          joystick.dy = 0;
          if (knobRef.current) knobRef.current.style.transform = "translate(0px, 0px)";
        }
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  return (
    <div
      ref={baseRef}
      style={{
        position: "fixed",
        bottom: "44px", left: "44px",
        width: JOYSTICK_R * 2, height: JOYSTICK_R * 2,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 20, touchAction: "none",
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: KNOB_R * 2, height: KNOB_R * 2,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.22)",
          border: "1px solid rgba(255,255,255,0.35)",
          transition: "transform 0.05s",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default MobileJoystick;
