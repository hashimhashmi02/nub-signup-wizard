/** Authored hero illustration — a disco-lit "pack" of campus avatars. */
const PEOPLE = [
  { initials: "AS", bg: "var(--violet-500)", fg: "#fff" },
  { initials: "MK", bg: "var(--pink-500)", fg: "#fff" },
  { initials: "RJ", bg: "var(--sun-400)", fg: "#2b1c00" },
  { initials: "TN", bg: "var(--cyan-400)", fg: "#04231d" },
  { initials: "PD", bg: "var(--tangerine)", fg: "#2b1400" },
];

export function AvatarPack() {
  return (
    <div className="pack" aria-hidden="true">
      <div className="pack__ring pack__ring--1" />
      <div className="pack__ring pack__ring--2" />
      <div className="pack__avatars">
        {PEOPLE.map((p, i) => (
          <span
            key={i}
            className="pack__avatar"
            style={{ background: p.bg, color: p.fg }}
          >
            {p.initials}
          </span>
        ))}
        <span className="pack__more">+2.4k</span>
      </div>
      <span className="pack__spark pack__spark--a" />
      <span className="pack__spark pack__spark--b" />
    </div>
  );
}

const PIECES = [
  { l: 6, t: 18, c: "var(--pink-500)", r: -18 },
  { l: 20, t: 62, c: "var(--lime-400)", r: 24 },
  { l: 34, t: 8, c: "var(--sun-400)", r: 40 },
  { l: 48, t: 48, c: "var(--cyan-400)", r: -32 },
  { l: 63, t: 14, c: "var(--violet-400)", r: 12 },
  { l: 78, t: 56, c: "var(--pink-400)", r: -44 },
  { l: 90, t: 22, c: "var(--lime-400)", r: 30 },
  { l: 12, t: 120, c: "var(--sun-400)", r: -12 },
  { l: 86, t: 128, c: "var(--violet-400)", r: 36 },
  { l: 52, t: 150, c: "var(--pink-500)", r: -22 },
];

/** Static confetti sprinkle behind the landing header. */
export function ConfettiSprinkle() {
  return (
    <div className="landing__confetti" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.l}%`,
            top: `${p.t}px`,
            background: p.c,
            transform: `rotate(${p.r}deg)`,
            borderRadius: i % 3 === 0 ? "999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
