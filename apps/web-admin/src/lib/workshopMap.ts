/** Bhosari, Pune — default workshop pin (override via Vite env on Location page). */
export const DEFAULT_WORKSHOP_LAT = "18.6298";
export const DEFAULT_WORKSHOP_LNG = "73.8478";

export function buildWorkshopMapEmbedUrl(lat: string, lng: string, zoom = 14): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}

export function buildWorkshopMapOpenUrl(lat: string, lng: string): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
