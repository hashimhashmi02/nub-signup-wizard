export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <span className="brandmark" style={{ fontSize: size }}>
      <span className="brandmark__word">nub</span>
      <span className="brandmark__dot" aria-hidden="true" />
    </span>
  );
}

/** Rounded-square glyph version, for badges / the device status bar. */
export function BrandGlyph({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="NUB"
    >
      <rect width="64" height="64" rx="16" fill="var(--violet-500)" />
      <path
        d="M20 44V20h5.4l13.2 15.1V20H44v24h-5.4L25.4 28.9V44H20z"
        fill="#fff"
      />
      <circle cx="46" cy="20" r="5" fill="var(--pink-500)" />
    </svg>
  );
}
