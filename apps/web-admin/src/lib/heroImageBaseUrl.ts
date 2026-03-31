/** Strip fixed `&w=` from Unsplash URL so the landing page can build srcset sizes. */
export function heroImageBaseUrl(fullSrc: string): string {
  const i = fullSrc.indexOf("&w=");
  return i === -1 ? fullSrc : fullSrc.slice(0, i);
}
