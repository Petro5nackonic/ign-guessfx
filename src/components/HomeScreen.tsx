function landingCalendarDate(): { iso: string; label: string } {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const label = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return { iso, label };
}

type HomeScreenProps = {
  onPlay: () => void;
};

function LandingMark() {
  return (
    <svg
      className="landing-mark-svg"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      aria-hidden
    >
      <rect
        x="8"
        y="8"
        width="64"
        height="64"
        rx="18"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.12)"
      />
      <path
        d="M42 26v28"
        stroke="var(--mint)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M34 30v20"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M26 34v12"
        stroke="rgba(80,200,148,0.55)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M50 32v16"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M58 36v8"
        stroke="var(--mint)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
  const { iso, label } = landingCalendarDate();

  return (
    <div className="shell shell--landing">
      <div className="atmosphere" aria-hidden />
      <div className="atmosphere-vignette" aria-hidden />

      <main className="landing">
        <div className="landing-mark">
          <LandingMark />
        </div>

        <h1 className="landing-title">GuesSFX</h1>

        <p className="landing-blurb">
          Guess the game from the audio clues. The less clues used, the higher your score.
        </p>

        <button type="button" className="cta-submit landing-play" onClick={onPlay}>
          Play
        </button>

        <div className="landing-puzzle-meta">
          <time className="landing-puzzle-date" dateTime={iso}>
            {label}
          </time>
          <span className="landing-puzzle-number">Puzzle #001</span>
        </div>
      </main>
    </div>
  );
}
