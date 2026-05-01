const TM_RE = /[\u2122\u00ae]/g;

export function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(TM_RE, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesGuess(guess: string, acceptableTitles: string[]): boolean {
  const g = normalizeTitle(guess);
  if (!g) return false;

  for (const raw of acceptableTitles) {
    const a = normalizeTitle(raw);
    if (!a) continue;

    if (a === g) return true;

    const shorter = g.length <= a.length ? g : a;
    const longer = g.length > a.length ? g : a;
    if (shorter.length >= 5 && longer.includes(shorter)) return true;

    const gw = new Set(g.split(" "));
    const aw = new Set(a.split(" "));
    let overlap = 0;
    for (const w of gw) {
      if (w.length >= 3 && aw.has(w)) overlap++;
    }
    if (overlap >= 2 && g.length >= 8) return true;
  }

  return false;
}
