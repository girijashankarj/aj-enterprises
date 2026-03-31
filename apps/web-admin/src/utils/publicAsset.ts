/** Resolve `public/` URLs so they work when Vite `base` is a subpath (e.g. GitHub Pages). */
export function publicAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL;
  const normalized = path.replace(/^\//, "");
  return `${base}${normalized}`;
}
