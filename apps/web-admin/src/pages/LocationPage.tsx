import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import {
  buildWorkshopMapEmbedUrl,
  buildWorkshopMapOpenUrl,
  DEFAULT_WORKSHOP_LAT,
  DEFAULT_WORKSHOP_LNG
} from "../lib/workshopMap";

export default function LocationPage() {
  const lat = import.meta.env.VITE_WORKSHOP_LATITUDE ?? DEFAULT_WORKSHOP_LAT;
  const lng = import.meta.env.VITE_WORKSHOP_LONGITUDE ?? DEFAULT_WORKSHOP_LNG;
  const workshopName = import.meta.env.VITE_WORKSHOP_NAME ?? "AJ Enterprises";
  const embedUrl =
    import.meta.env.VITE_WORKSHOP_MAP_EMBED_URL ?? buildWorkshopMapEmbedUrl(lat, lng, 15);
  const externalUrl = import.meta.env.VITE_WORKSHOP_MAP_URL ?? buildWorkshopMapOpenUrl(lat, lng);

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Workshop Location</CardTitle>
        <CardDescription>
          View the workshop on Google Maps. Coordinates: {lat}, {lng}
        </CardDescription>
        <div className="mt-4">
          <a
            className="inline-flex min-h-11 items-center rounded-lg bg-[var(--color-brand-primary)] px-4 text-sm font-medium text-white"
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <iframe
          title={`${workshopName} map`}
          src={embedUrl}
          className="h-[420px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Card>
    </div>
  );
}
