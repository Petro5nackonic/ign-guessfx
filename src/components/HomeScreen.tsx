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
      </main>
    </div>
  );
}
