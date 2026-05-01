/** Points when guessing correctly after hearing clues through snippet index `furthestSnippetIndex` (0-based: 0 = first snippet only). */
export function pointsForFurthestSnippet(furthestSnippetIndex: number): number {
  const clamped = Math.min(4, Math.max(0, furthestSnippetIndex));
  return 150 - clamped * 12.5;
}
