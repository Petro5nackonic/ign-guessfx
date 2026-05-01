/** Direct file URL inside an Internet Archive item (`identifier`, path may include `/`). */
export function archiveOrgFile(identifier: string, pathWithinItem: string): string {
  const segments = pathWithinItem.split("/").filter(Boolean);
  return (
    `https://archive.org/download/${encodeURIComponent(identifier)}/` +
    segments.map((s) => encodeURIComponent(s)).join("/")
  );
}
