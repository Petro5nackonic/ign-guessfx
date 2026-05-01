import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GAME_CATALOG } from "../data/gameCatalog";
import {
  pickSessionRounds,
  ROUNDS_PER_SESSION,
  type GameRound,
} from "../data/rounds";
import { matchesGuess } from "../utils/matchGuess";
import { pointsForFurthestSnippet } from "../utils/scoring";

function fmtPts(p: number): string {
  return Number.isInteger(p) ? String(p) : p.toFixed(1);
}

function clueAdvancePenalty(fromIdx: number): number {
  return (
    pointsForFurthestSnippet(fromIdx) - pointsForFurthestSnippet(fromIdx + 1)
  );
}

/** Each clue plays from the start of the file but stops after this many seconds. */
const MAX_SNIPPET_SECONDS = 10;

/** Collapsed row backgrounds — stepped navy from Figma (clues 1→5). */
const CLUE_TIER_BG = ["#202d3c", "#192431", "#151e28", "#121a24", "#0d141c"];
const CLUE_EXPANDED_BG = "#202d3c";

function catalogMatches(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return GAME_CATALOG.filter((g) => g.title.toLowerCase().includes(q)).slice(
    0,
    8,
  );
}

function IconPlay() {
  return (
    <svg width="18" height="18" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
      <path d="M0 1.5v13l12-6.5L0 1.5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="16" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden>
      <rect x="0" y="1" width="4" height="16" rx="1" />
      <rect x="8" y="1" width="4" height="16" rx="1" />
    </svg>
  );
}

function IconSkip() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 14" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="M0 2h2v10H0V2zm4 0 10 5.08L4 12V2zm14-2v14h-2V0h2z"
      />
    </svg>
  );
}

function IconReplay() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10a8 8 0 1 1 2.83 6M4 14v-4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlayRow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
      <path d="M0 1.5v13l12-6.5L0 1.5z" />
    </svg>
  );
}

function IconPauseRow() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 18" fill="currentColor" aria-hidden>
      <rect x="0" y="1" width="4" height="16" rx="1" />
      <rect x="8" y="1" width="4" height="16" rx="1" />
    </svg>
  );
}

/** Circle-xmark style — matches Figma incorrect-guess icon (#a33). */
function IconWrongGuess() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="wrong-guess-icon"
    >
      <circle cx="12" cy="12" r="10" fill="#aa3333" />
      <path
        d="M15 9l-6 6M9 9l6 6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type WrongGuess = { clueIndex: number; text: string };

type CompletedRoundSummary = {
  thumbnail: string;
  title: string;
  releaseYear: number;
  snippetCount: number;
  /** Highest clue tier reached this round (1–5). */
  cluesReached: number;
  outcome: "correct" | "skipped";
  roundPoints: number;
  wrongGuesses: WrongGuess[];
  winningGuess?: string;
};

type CorrectRevealState = {
  thumbnail: string;
  title: string;
  roundPoints: number;
  isLastRound: boolean;
  /** 1-based index of the round coming next (only meaningful when !isLastRound). */
  nextRoundNumber: number;
};

type AudioGameProps = {
  /** When set, run-complete screen can return to the landing page. */
  onHome?: () => void;
};

export function AudioGame({ onHome }: AudioGameProps) {
  const [sessionRounds, setSessionRounds] = useState<GameRound[]>(() =>
    pickSessionRounds(ROUNDS_PER_SESSION),
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<"playing" | "complete">("playing");
  const [totalScore, setTotalScore] = useState(0);
  const [sessionRoundSummaries, setSessionRoundSummaries] = useState<
    CompletedRoundSummary[]
  >([]);

  const round = sessionRounds[roundIndex]!;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  /** After "Next clue" (footer or accordion skip), autoplay once `snippetSrc` loads. */
  const autoplayMainAfterSnippetSrcChangeRef = useRef(false);

  const [furthestSnippetIndex, setFurthestSnippetIndex] = useState(0);
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [audioProgress, setAudioProgress] = useState({ cur: 0, dur: 0 });
  const [wrongGuesses, setWrongGuesses] = useState<WrongGuess[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctReveal, setCorrectReveal] = useState<CorrectRevealState | null>(
    null,
  );
  const [previewClueIndex, setPreviewClueIndex] = useState<number | null>(null);
  const [previewProgress, setPreviewProgress] = useState({ cur: 0, dur: 0 });
  const [previewIsPlaying, setPreviewIsPlaying] = useState(false);
  const [exitOverlayOpen, setExitOverlayOpen] = useState(false);

  const snippetSrc = round.snippets[selectedSnippetIndex]!.audioSrc;

  const stopPreviewPlayback = useCallback(() => {
    const p = previewAudioRef.current;
    if (p) {
      p.pause();
      p.removeAttribute("src");
      void p.load();
    }
    setPreviewClueIndex(null);
    setPreviewProgress({ cur: 0, dur: 0 });
    setPreviewIsPlaying(false);
  }, []);

  const syncAudioSrc = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    stopPreviewPlayback();
    el.pause();
    el.currentTime = 0;
    el.src = snippetSrc;
    void el.load();
    setAudioProgress({ cur: 0, dur: 0 });
    setIsPlaying(false);
  }, [snippetSrc, stopPreviewPlayback]);

  const playSnippet = useCallback(async () => {
    stopPreviewPlayback();
    const el = audioRef.current;
    if (!el) return;
    if (el.currentTime >= MAX_SNIPPET_SECONDS - 0.02) {
      el.currentTime = 0;
      setAudioProgress((p) => ({
        cur: 0,
        dur: p.dur > 0 ? p.dur : 0,
      }));
    }
    try {
      await el.play();
    } catch {
      setFeedback("Tap Play again to unlock audio.");
      window.setTimeout(() => setFeedback(null), 2600);
    }
  }, [stopPreviewPlayback]);

  useEffect(() => {
    syncAudioSrc();
  }, [syncAudioSrc]);

  useEffect(() => {
    if (!autoplayMainAfterSnippetSrcChangeRef.current) return;
    const el = audioRef.current;
    if (!el || !snippetSrc) return;

    const run = () => {
      if (!autoplayMainAfterSnippetSrcChangeRef.current) return;
      autoplayMainAfterSnippetSrcChangeRef.current = false;
      void playSnippet();
    };

    if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      run();
      return;
    }

    const onCanPlay = () => run();
    el.addEventListener("canplay", onCanPlay, { once: true });
    return () => el.removeEventListener("canplay", onCanPlay);
  }, [snippetSrc, playSnippet]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const tick = () => {
      if (el.currentTime >= MAX_SNIPPET_SECONDS) {
        el.pause();
        el.currentTime = MAX_SNIPPET_SECONDS;
      }
      const rawDur = Number.isFinite(el.duration) ? el.duration : 0;
      const cappedDur =
        rawDur > 0 ? Math.min(rawDur, MAX_SNIPPET_SECONDS) : 0;
      setAudioProgress({
        cur: Math.min(el.currentTime, MAX_SNIPPET_SECONDS),
        dur: cappedDur,
      });
    };
    el.addEventListener("timeupdate", tick);
    el.addEventListener("loadedmetadata", tick);
    el.addEventListener("ended", tick);
    return () => {
      el.removeEventListener("timeupdate", tick);
      el.removeEventListener("loadedmetadata", tick);
      el.removeEventListener("ended", tick);
    };
  }, [snippetSrc]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const syncPlaying = () => setIsPlaying(!el.paused);
    el.addEventListener("play", syncPlaying);
    el.addEventListener("playing", syncPlaying);
    el.addEventListener("pause", syncPlaying);
    el.addEventListener("ended", syncPlaying);
    return () => {
      el.removeEventListener("play", syncPlaying);
      el.removeEventListener("playing", syncPlaying);
      el.removeEventListener("pause", syncPlaying);
      el.removeEventListener("ended", syncPlaying);
    };
  }, [snippetSrc]);

  useEffect(() => {
    const el = previewAudioRef.current;
    if (!el) return;
    const tick = () => {
      if (el.currentTime >= MAX_SNIPPET_SECONDS) {
        el.pause();
        el.currentTime = MAX_SNIPPET_SECONDS;
      }
      const rawDur = Number.isFinite(el.duration) ? el.duration : 0;
      const cappedDur =
        rawDur > 0 ? Math.min(rawDur, MAX_SNIPPET_SECONDS) : 0;
      setPreviewProgress({
        cur: Math.min(el.currentTime, MAX_SNIPPET_SECONDS),
        dur: cappedDur,
      });
    };
    el.addEventListener("timeupdate", tick);
    el.addEventListener("loadedmetadata", tick);
    el.addEventListener("ended", tick);
    return () => {
      el.removeEventListener("timeupdate", tick);
      el.removeEventListener("loadedmetadata", tick);
      el.removeEventListener("ended", tick);
    };
  }, []);

  useEffect(() => {
    const el = previewAudioRef.current;
    if (!el) return;
    const syncPlaying = () => setPreviewIsPlaying(!el.paused);
    el.addEventListener("play", syncPlaying);
    el.addEventListener("playing", syncPlaying);
    el.addEventListener("pause", syncPlaying);
    el.addEventListener("ended", syncPlaying);
    return () => {
      el.removeEventListener("play", syncPlaying);
      el.removeEventListener("playing", syncPlaying);
      el.removeEventListener("pause", syncPlaying);
      el.removeEventListener("ended", syncPlaying);
    };
  }, []);

  useEffect(() => {
    setFurthestSnippetIndex(0);
    setSelectedSnippetIndex(0);
    setGuess("");
    setFeedback(null);
    setOpenSuggestions(false);
    setPendingAdvance(false);
    setWrongGuesses([]);
    setIsPlaying(false);
    setCorrectReveal(null);
    const p = previewAudioRef.current;
    if (p) {
      p.pause();
      p.removeAttribute("src");
      void p.load();
    }
    setPreviewClueIndex(null);
    setPreviewProgress({ cur: 0, dur: 0 });
    setPreviewIsPlaying(false);
  }, [roundIndex]);

  useEffect(() => {
    if (!exitOverlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExitOverlayOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitOverlayOpen]);

  const suggestions = useMemo(() => catalogMatches(guess), [guess]);

  const sortedWrongGuessesForSummary = (wrongs: WrongGuess[]) =>
    [...wrongs].sort((a, b) =>
      a.clueIndex !== b.clueIndex
        ? a.clueIndex - b.clueIndex
        : a.text.localeCompare(b.text),
    );

  const progressPct =
    audioProgress.dur > 0
      ? Math.min(100, (audioProgress.cur / audioProgress.dur) * 100)
      : 0;

  const togglePassedCluePreview = async (idx: number) => {
    if (pendingAdvance) return;
    const prevEl = previewAudioRef.current;
    const mainEl = audioRef.current;
    if (!prevEl) return;
    mainEl?.pause();

    if (previewClueIndex === idx && previewIsPlaying) {
      prevEl.pause();
      return;
    }
    if (previewClueIndex === idx && !previewIsPlaying) {
      if (prevEl.currentTime >= MAX_SNIPPET_SECONDS - 0.02) {
        prevEl.currentTime = 0;
        setPreviewProgress((p) => ({ cur: 0, dur: p.dur > 0 ? p.dur : 0 }));
      }
      try {
        await prevEl.play();
      } catch {
        setFeedback("Tap Play again to unlock audio.");
        window.setTimeout(() => setFeedback(null), 2600);
      }
      return;
    }

    prevEl.pause();
    prevEl.currentTime = 0;
    const src = round.snippets[idx]!.audioSrc;
    prevEl.src = src;
    void prevEl.load();
    setPreviewClueIndex(idx);
    setPreviewProgress({ cur: 0, dur: 0 });
    try {
      await prevEl.play();
    } catch {
      setFeedback("Tap Play again to unlock audio.");
      window.setTimeout(() => setFeedback(null), 2600);
    }
  };

  const togglePlayback = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void playSnippet();
    else el.pause();
  };

  const replaySnippet = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void playSnippet();
  };

  const nextSnippet = () => {
    if (furthestSnippetIndex >= 4) return;
    autoplayMainAfterSnippetSrcChangeRef.current = true;
    const next = furthestSnippetIndex + 1;
    setFurthestSnippetIndex(next);
    setSelectedSnippetIndex(next);
    setFeedback(null);
  };

  const advanceRound = (scoreDelta: number, summary: string) => {
    setPendingAdvance(true);
    setTotalScore((s) => s + scoreDelta);
    setFeedback(summary);

    const snapshot: CompletedRoundSummary = {
      thumbnail: round.thumbnail,
      title: round.displayAnswer,
      releaseYear: round.releaseYear,
      snippetCount: round.snippets.length,
      cluesReached: furthestSnippetIndex + 1,
      outcome: "skipped",
      roundPoints: scoreDelta,
      wrongGuesses: wrongGuesses.map((w) => ({ ...w })),
    };

    window.setTimeout(() => {
      setFeedback(null);
      setPendingAdvance(false);
      setSessionRoundSummaries((prev) => [...prev, snapshot]);
      if (roundIndex >= sessionRounds.length - 1) {
        autoplayMainAfterSnippetSrcChangeRef.current = false;
        setPhase("complete");
      } else {
        setRoundIndex((i) => i + 1);
      }
    }, 2200);
  };

  const dismissCorrectReveal = () => {
    setCorrectReveal(null);
    setPendingAdvance(false);
    if (roundIndex >= sessionRounds.length - 1) {
      setPhase("complete");
    } else {
      setRoundIndex((i) => i + 1);
    }
  };

  const submitGuess = () => {
    if (pendingAdvance) return;
    const trimmed = guess.trim();
    const ok = matchesGuess(trimmed, round.acceptableAnswers);
    if (ok) {
      const pts = pointsForFurthestSnippet(furthestSnippetIndex);
      stopPreviewPlayback();
      audioRef.current?.pause();
      setPendingAdvance(true);
      setTotalScore((s) => s + pts);
      setSessionRoundSummaries((prev) => [
        ...prev,
        {
          thumbnail: round.thumbnail,
          title: round.displayAnswer,
          releaseYear: round.releaseYear,
          snippetCount: round.snippets.length,
          cluesReached: furthestSnippetIndex + 1,
          outcome: "correct",
          roundPoints: pts,
          wrongGuesses: wrongGuesses.map((w) => ({ ...w })),
          winningGuess: trimmed,
        },
      ]);
      setCorrectReveal({
        thumbnail: round.thumbnail,
        title: round.displayAnswer,
        roundPoints: pts,
        isLastRound: roundIndex >= sessionRounds.length - 1,
        nextRoundNumber: roundIndex + 2,
      });
      return;
    }
    setWrongGuesses((prev) => [
      ...prev,
      { clueIndex: selectedSnippetIndex, text: trimmed },
    ]);
    setGuess("");
    setFeedback("Not quite — try again or move to the next clue.");
    window.setTimeout(() => setFeedback(null), 2400);
  };

  const giveUp = () => {
    if (pendingAdvance) return;
    advanceRound(0, `Round over — ${round.displayAnswer}. +0 pts`);
  };

  const pickSuggestion = (title: string) => {
    setGuess(title);
    setOpenSuggestions(false);
  };

  const applyFullSessionReset = useCallback(() => {
    setSessionRounds(pickSessionRounds(ROUNDS_PER_SESSION));
    setRoundIndex(0);
    setPhase("playing");
    setTotalScore(0);
    setFurthestSnippetIndex(0);
    setSelectedSnippetIndex(0);
    setGuess("");
    setFeedback(null);
    setPendingAdvance(false);
    setWrongGuesses([]);
    setIsPlaying(false);
    setCorrectReveal(null);
    stopPreviewPlayback();
    setSessionRoundSummaries([]);
  }, [stopPreviewPlayback]);

  const confirmExitOverlay = useCallback(() => {
    setExitOverlayOpen(false);
    stopPreviewPlayback();
    audioRef.current?.pause();
    if (onHome) {
      onHome();
    } else {
      applyFullSessionReset();
    }
  }, [onHome, stopPreviewPlayback, applyFullSessionReset]);

  if (phase === "complete") {
    return (
      <div className="shell">
        <div className="atmosphere" aria-hidden />
        <div className="shell-complete">
          <h2>Run complete</h2>
          <p className="score-big-complete">{fmtPts(totalScore)}</p>

          <ul className="run-summary-list" aria-label="Round by round summary">
            {sessionRoundSummaries.map((row, i) => {
              const wrongs = sortedWrongGuessesForSummary(row.wrongGuesses);
              return (
                <li key={`${row.title}-${i}`} className="run-summary-row">
                  <img
                    className="run-summary-thumb"
                    src={row.thumbnail}
                    alt=""
                  />
                  <div className="run-summary-body">
                    <p className="run-summary-round-kicker">Round {i + 1}</p>
                    <p className="run-summary-title">{row.title}</p>
                    <p className="run-summary-released">
                      Released {row.releaseYear}
                    </p>
                    <div className="run-summary-detail">
                      <p className="run-summary-line">
                        <span
                          className={
                            row.outcome === "correct"
                              ? "run-summary-pill run-summary-pill--ok"
                              : "run-summary-pill run-summary-pill--skip"
                          }
                        >
                          {row.outcome === "correct" ? "Solved" : "Skipped"}
                        </span>
                        <span className="run-summary-sep" aria-hidden>
                          ·
                        </span>
                        <span>
                          Clues reached: {row.cluesReached} / {row.snippetCount}
                        </span>
                        <span className="run-summary-sep" aria-hidden>
                          ·
                        </span>
                        <span>
                          Round score:{" "}
                          {row.roundPoints > 0 ? "+" : ""}
                          {fmtPts(row.roundPoints)} pts
                        </span>
                      </p>
                      {row.winningGuess !== undefined && (
                        <p className="run-summary-guess">
                          Your guess:{" "}
                          <em>&ldquo;{row.winningGuess}&rdquo;</em>
                        </p>
                      )}
                      {wrongs.length > 0 ? (
                        <ul className="run-summary-wrongs">
                          {wrongs.map((w, wi) => (
                            <li key={`${w.clueIndex}-${wi}-${w.text}`}>
                              <span className="run-summary-wrong-clue">
                                Clue {w.clueIndex + 1}
                              </span>
                              <span className="run-summary-wrong-text">
                                &ldquo;{w.text}&rdquo;
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="run-summary-no-wrongs">
                          No incorrect guesses this round.
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="muted run-summary-footnote">
            Each run picks random titles from{" "}
            <code>src/data/rounds.ts</code>.
          </p>
          <button
            type="button"
            className="cta-submit"
            onClick={() => {
              setSessionRounds(pickSessionRounds(ROUNDS_PER_SESSION));
              setRoundIndex(0);
              setPhase("playing");
              setTotalScore(0);
              setFurthestSnippetIndex(0);
              setSelectedSnippetIndex(0);
              setGuess("");
              setFeedback(null);
              setPendingAdvance(false);
              setWrongGuesses([]);
              setIsPlaying(false);
              setCorrectReveal(null);
              stopPreviewPlayback();
              setSessionRoundSummaries([]);
            }}
          >
            Play again
          </button>
          {onHome && (
            <button type="button" className="btn-next-clue landing-back-home" onClick={onHome}>
              Back to home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <audio ref={audioRef} preload="auto" className="hidden-audio" />
      <audio ref={previewAudioRef} preload="none" className="hidden-audio" />

      <div className="atmosphere" aria-hidden />
      <div className="atmosphere-vignette" aria-hidden />

      <div className="shell-main">
        <header className="game-header">
          <button
            type="button"
            className="btn-icon-glass btn-icon-glass--exit"
            aria-label="Exit — open confirmation"
            aria-expanded={exitOverlayOpen}
            aria-haspopup="dialog"
            disabled={pendingAdvance}
            onClick={() => setExitOverlayOpen(true)}
          >
            <svg viewBox="0 0 10 17" fill="none" aria-hidden>
              <path
                d="M8.5 1L2 8.5L8.5 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="btn-icon-glass-label">exit</span>
          </button>
          <div className="header-stats">
            <p className="score-line">Score: {fmtPts(totalScore)}</p>
            <p className="round-line">
              Round: {roundIndex + 1}/{sessionRounds.length}
            </p>
          </div>
          <div className="header-spacer" aria-hidden />
        </header>

        <section className="main-scroll">
          <div className="clue-accordion">
            {round.snippets.map((_, idx) => {
              const locked = idx > furthestSnippetIndex;
              const expanded = idx === selectedSnippetIndex;
              const passed = idx < furthestSnippetIndex;
              const wrongHere = wrongGuesses.filter((w) => w.clueIndex === idx);
              const tierBg = CLUE_TIER_BG[idx] ?? "#0d141c";

              const tierClass = [
                "clue-tier",
                expanded ? "clue-tier--expanded" : "clue-tier--collapsed",
              ]
                .filter(Boolean)
                .join(" ");

              if (expanded) {
                return (
                  <div
                    key={idx}
                    className={tierClass}
                    style={{ backgroundColor: CLUE_EXPANDED_BG }}
                  >
                    <div className="accordion-expanded-inner">
                      <div className="accordion-active-head">
                        <h3 className="accordion-active-title">Clue {idx + 1}</h3>
                        <div className="accordion-progress">
                          <div
                            className="accordion-progress-fill"
                            style={{ width: `${progressPct}%` }}
                          />
                          <div className="accordion-progress-rest" aria-hidden />
                        </div>
                      </div>
                      <div className="accordion-dials">
                        <button
                          type="button"
                          className="ctrl-circle ctrl-circle--ghost"
                          aria-label="Replay clue"
                          disabled={pendingAdvance}
                          onClick={() => replaySnippet()}
                        >
                          <IconReplay />
                        </button>
                        <button
                          type="button"
                          className="ctrl-circle ctrl-circle--play"
                          aria-label={
                            isPlaying ? `Pause clue ${idx + 1}` : `Play clue ${idx + 1}`
                          }
                          disabled={pendingAdvance}
                          onClick={() => togglePlayback()}
                        >
                          {isPlaying ? <IconPause /> : <IconPlay />}
                        </button>
                        <button
                          type="button"
                          className="ctrl-circle ctrl-circle--ghost"
                          aria-label="Next clue"
                          disabled={furthestSnippetIndex >= 4 || pendingAdvance}
                          onClick={() => nextSnippet()}
                        >
                          <IconSkip />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              const previewingThis = previewClueIndex === idx;
              const previewPct =
                previewingThis && previewProgress.dur > 0
                  ? Math.min(
                      100,
                      (previewProgress.cur / previewProgress.dur) * 100,
                    )
                  : 0;

              if (passed) {
                return (
                  <div
                    key={idx}
                    className={tierClass}
                    style={{ backgroundColor: tierBg }}
                  >
                    <div className="accordion-passed-inner">
                      <div className="accordion-passed-row">
                        <div className="accordion-passed-main">
                          <div className="accordion-passed-head">
                            <span className="accordion-row-label">
                              Clue {idx + 1}
                            </span>
                            <span className="accordion-row-penalty">
                              −{fmtPts(clueAdvancePenalty(idx))} pts
                            </span>
                          </div>
                          <div
                            className="accordion-passed-progress"
                            aria-hidden
                          >
                            <div
                              className="accordion-progress-fill"
                              style={{ width: `${previewPct}%` }}
                            />
                            <div className="accordion-progress-rest" />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="accordion-passed-play"
                          disabled={pendingAdvance}
                          aria-label={
                            previewingThis && previewIsPlaying
                              ? `Pause preview for clue ${idx + 1}`
                              : `Play clue ${idx + 1} (preview)`
                          }
                          onClick={() => void togglePassedCluePreview(idx)}
                        >
                          {previewingThis && previewIsPlaying ? (
                            <IconPauseRow />
                          ) : (
                            <IconPlayRow />
                          )}
                          <span>Play</span>
                        </button>
                      </div>
                      {wrongHere.map((w, wi) => (
                        <div key={`${idx}-${wi}`} className="wrong-guess-row">
                          <IconWrongGuess />
                          <span className="wrong-guess-text">{w.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={tierClass}
                  style={{ backgroundColor: tierBg }}
                >
                  <button
                    type="button"
                    className={`accordion-row ${locked ? "accordion-row--locked" : ""}`}
                    disabled={locked || pendingAdvance}
                    onClick={() => {
                      if (!locked && !pendingAdvance) {
                        setSelectedSnippetIndex(idx);
                      }
                    }}
                  >
                    <span className="accordion-row-label">Clue {idx + 1}</span>
                  </button>
                  {wrongHere.map((w, wi) => (
                    <div key={`${idx}-${wi}`} className="wrong-guess-row">
                      <IconWrongGuess />
                      <span className="wrong-guess-text">{w.text}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="guess-sheet">
          <div className="fields-wrap">
            <div
              className={`combo-sheet ${feedback?.startsWith("Not") ? "input-error" : ""}`}
            >
              <input
                id="guess-input"
                autoComplete="off"
                placeholder="Type your guess here"
                value={guess}
                disabled={pendingAdvance}
                onChange={(e) => {
                  setGuess(e.target.value);
                  setOpenSuggestions(true);
                }}
                onFocus={() => setOpenSuggestions(true)}
                onBlur={() =>
                  window.setTimeout(() => setOpenSuggestions(false), 120)
                }
              />
              {openSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-sheet">
                  {suggestions.map((g) => (
                    <li key={g.title}>
                      <button
                        type="button"
                        onMouseDown={() => pickSuggestion(g.title)}
                      >
                        <img src={g.thumbnail} alt="" />
                        <span>{g.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className="cta-submit"
              disabled={pendingAdvance || !guess.trim()}
              onClick={() => submitGuess()}
            >
              Submit
            </button>

            <button
              type="button"
              className="btn-next-clue"
              disabled={furthestSnippetIndex >= 4 || pendingAdvance}
              onClick={() => nextSnippet()}
            >
              Next Clue
            </button>

            <button
              type="button"
              className="link-skip-round"
              disabled={pendingAdvance}
              onClick={() => giveUp()}
            >
              Skip this round (0pts)
            </button>

            {feedback && (
              <p
                className={`banner-sheet ${feedback.startsWith("Not") ? "warn" : "good"}`}
              >
                {feedback}
              </p>
            )}
          </div>
        </footer>
      </div>

      {correctReveal && (
        <div
          className="correct-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="correct-overlay-heading"
        >
          <div className="correct-overlay-card">
            <p id="correct-overlay-heading" className="correct-overlay-kicker">
              You got it!
            </p>
            <p className="correct-overlay-score-line">
              Score{" "}
              <strong className="correct-overlay-score-value">{fmtPts(totalScore)}</strong>
              <span className="correct-overlay-round-pts">
                {" "}(+{fmtPts(correctReveal.roundPoints)} this round)
              </span>
            </p>
            <div className="correct-overlay-thumb-wrap">
              <img src={correctReveal.thumbnail} alt={correctReveal.title} />
            </div>
            <p className="correct-overlay-game-title">{correctReveal.title}</p>
            <button
              type="button"
              className="cta-submit correct-overlay-cta"
              onClick={dismissCorrectReveal}
            >
              {correctReveal.isLastRound
                ? "See final score"
                : `Start Round ${correctReveal.nextRoundNumber}`}
            </button>
          </div>
        </div>
      )}

      {exitOverlayOpen && (
        <div
          className="correct-overlay exit-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-overlay-heading"
        >
          <div className="correct-overlay-card exit-confirm-card">
            <p id="exit-overlay-heading" className="exit-confirm-message">
              Exit round and return to home screen?
            </p>
            <div className="exit-confirm-actions">
              <button
                type="button"
                className="cta-submit exit-confirm-primary"
                onClick={confirmExitOverlay}
              >
                confirm
              </button>
              <button
                type="button"
                className="btn-next-clue"
                onClick={() => setExitOverlayOpen(false)}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
