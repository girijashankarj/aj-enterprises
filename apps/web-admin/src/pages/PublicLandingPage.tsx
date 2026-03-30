import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE } from "../config/site";
import { getPublicContact, getSocialUrls, PUBLIC_MARKETING } from "../config/publicMarketing";
import { usePageTitle } from "../hooks/usePageTitle";
import { cn } from "../lib/cn";
import { shouldTryApiFirst, submitPublicLead } from "../lib/submitPublicLead";
import {
  buildWorkshopMapEmbedUrl,
  buildWorkshopMapOpenUrl,
  DEFAULT_WORKSHOP_LAT,
  DEFAULT_WORKSHOP_LNG
} from "../lib/workshopMap";
import { BrandLogo } from "../components/BrandLogo";
import { HeaderControls } from "../components/layout/HeaderControls";
import { StandardHeader } from "../components/layout/StandardHeader";
import { trackGenerateLead } from "../lib/analytics";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const btnPrimary =
  "inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] px-5 py-0 text-sm font-medium text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40";
const btnHeroSecondary =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-white/40 bg-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
const btnHeroPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] px-6 py-3 text-base font-medium text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40";

const HERO_IMG_BASE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop";
const heroSrcDefault = `${HERO_IMG_BASE}&w=1600&q=82`;
const heroSrcSet = `${HERO_IMG_BASE}&w=640&q=80 640w, ${HERO_IMG_BASE}&w=1200&q=80 1200w, ${HERO_IMG_BASE}&w=1800&q=82 1800w`;

const inputClass =
  "w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-sm placeholder:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40";

export default function PublicLandingPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  usePageTitle(SITE.name);
  const contact = getPublicContact();
  const social = getSocialUrls();
  const [formPhase, setFormPhase] = useState<"idle" | "submitting" | "success_api" | "success_mailto" | "error">(
    "idle"
  );
  const [formError, setFormError] = useState<string | null>(null);

  const mapLat = import.meta.env.VITE_WORKSHOP_LATITUDE ?? DEFAULT_WORKSHOP_LAT;
  const mapLng = import.meta.env.VITE_WORKSHOP_LONGITUDE ?? DEFAULT_WORKSHOP_LNG;
  const workshopName = import.meta.env.VITE_WORKSHOP_NAME ?? SITE.name;
  const mapEmbedUrl =
    import.meta.env.VITE_WORKSHOP_MAP_EMBED_URL ?? buildWorkshopMapEmbedUrl(mapLat, mapLng, 14);
  const mapOpenUrl = import.meta.env.VITE_WORKSHOP_MAP_URL ?? buildWorkshopMapOpenUrl(mapLat, mapLng);

  const utm = useMemo(() => {
    return {
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined
    };
  }, [searchParams]);

  const openMailto = (name: string, email: string, subject: string, message: string) => {
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const company = String(fd.get("company") ?? "");

    if (shouldTryApiFirst()) {
      setFormPhase("submitting");
      const result = await submitPublicLead({
        name,
        email,
        subject,
        message,
        company,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        ...utm
      });

      if (result.ok && result.via === "api") {
        trackGenerateLead();
        setFormPhase("success_api");
        form.reset();
        return;
      }

      if (result.ok === false && result.error !== "no_api") {
        setFormPhase("error");
        setFormError(result.error === "network" ? t("landing.formErrorNetwork") : t("landing.formErrorGeneric"));
        return;
      }
    }

    openMailto(name, email, subject, message);
    setFormPhase("success_mailto");
    form.reset();
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <StandardHeader>
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,auto)_1fr_auto]">
          <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
            <Link
              to="/"
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              <BrandLogo />
            </Link>
            <div className="flex items-center gap-2 md:hidden">
              <HeaderControls />
              <Link to="/login" className={cn(btnPrimary, "px-3")}>
                {t("landing.loginCta")}
              </Link>
            </div>
          </div>
          <nav
            className="scrollbar-hide flex min-h-11 min-w-0 shrink-0 flex-nowrap items-center justify-start gap-x-4 gap-y-2 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-1 text-xs font-medium text-[var(--color-text-primary)]/85 md:flex-wrap md:justify-center md:overflow-visible md:pb-0 md:text-sm md:gap-5"
            aria-label={t("landing.navLabel")}
          >
            <a
              href="#services"
              className="shrink-0 whitespace-nowrap rounded-sm hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              {t("landing.navServices")}
            </a>
            <a
              href="#map"
              className="shrink-0 whitespace-nowrap rounded-sm hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              {t("landing.navMap")}
            </a>
            <a
              href="#clients"
              className="shrink-0 whitespace-nowrap rounded-sm hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              {t("landing.navClients")}
            </a>
            <a
              href="#faq"
              className="shrink-0 whitespace-nowrap rounded-sm hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              {t("landing.navFaq")}
            </a>
            <a
              href="#owner"
              className="shrink-0 whitespace-nowrap rounded-sm hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              {t("landing.navOwner")}
            </a>
            <a
              href="#contact"
              className="shrink-0 whitespace-nowrap rounded-sm hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/40"
            >
              {t("landing.navContact")}
            </a>
          </nav>
          <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
            <HeaderControls />
            <Link to="/login" className={cn(btnPrimary, "px-4")}>
              {t("landing.loginCta")}
            </Link>
          </div>
        </div>
      </StandardHeader>

      {/* Hero */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSrcDefault}
            srcSet={heroSrcSet}
            sizes="100vw"
            alt={SITE.heroPhoto.alt}
            width={1800}
            height={1200}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col justify-end px-4 pb-20 pt-28 text-center sm:px-6 sm:pb-28 sm:pt-36">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/80">{SITE.location}</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("landing.heroTitle")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/85 sm:text-xl">{t("landing.heroSubtitle")}</p>
          <div className="flex w-full max-w-md flex-col gap-3 self-center sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            <a href="#contact" className={cn(btnHeroPrimary, "w-full justify-center sm:w-auto")}>
              {t("landing.heroContact")}
            </a>
            <Link to="/login" className={cn(btnHeroSecondary, "w-full justify-center text-center sm:w-auto")}>
              {t("landing.heroLogin")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)] py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--color-brand-primary)]">{PUBLIC_MARKETING.workshop.employees}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("landing.statEmployees")}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--color-brand-primary)]">{PUBLIC_MARKETING.workshop.shifts}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("landing.statShifts")}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--color-brand-primary)]">{PUBLIC_MARKETING.workshop.experience}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("landing.statYears")}</p>
          </div>
        </div>
      </section>

      {/* Map — Bhosari, Pune */}
      <section id="map" className="scroll-mt-24 border-b border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-semibold sm:text-3xl">{t("landing.mapTitle")}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-[var(--color-text-secondary)]">{t("landing.mapIntro")}</p>
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-sm">
            <iframe
              title={t("landing.mapIframeTitle", { name: workshopName })}
              src={mapEmbedUrl}
              className="h-[min(420px,55vh)] w-full border-0 sm:h-[440px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border-default)] px-4 py-3">
              <p className="text-sm text-[var(--color-text-secondary)]">
                {SITE.location} · {mapLat}, {mapLng}
              </p>
              <a
                href={mapOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] px-4 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
              >
                {t("landing.openMapInGoogle")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-3 text-center text-2xl font-semibold sm:text-3xl">{t("landing.servicesTitle")}</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-[var(--color-text-secondary)]">
            {t("landing.servicesIntro")}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {PUBLIC_MARKETING.services.map((s) => (
              <Card key={s.title} className="border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{s.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section
        id="clients"
        className="scroll-mt-20 border-y border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">{t("landing.clientsTitle")}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PUBLIC_MARKETING.clients.map((c) => (
              <span
                key={c}
                className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)]"
              >
                {c}
              </span>
            ))}
            <span className="rounded-lg border border-dashed border-[var(--color-border-default)] px-6 py-3 text-sm text-[var(--color-text-secondary)]">
              {t("landing.clientsMore")}
            </span>
          </div>
        </div>
      </section>

      {/* Trust + FAQ (SEO) */}
      <section id="faq" className="scroll-mt-20 border-b border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">{t("landing.trustTitle")}</h2>
          <div className="mb-14 grid gap-6 md:grid-cols-3">
            <Card className="border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("landing.trust1Title")}</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t("landing.trust1Body")}</p>
            </Card>
            <Card className="border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("landing.trust2Title")}</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t("landing.trust2Body")}</p>
            </Card>
            <Card className="border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t("landing.trust3Title")}</p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t("landing.trust3Body")}</p>
            </Card>
          </div>
          <h3 className="mb-6 text-center text-xl font-semibold sm:text-2xl">{t("landing.faqTitle")}</h3>
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">{t("landing.faq1q")}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("landing.faq1a")}</p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">{t("landing.faq2q")}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("landing.faq2a")}</p>
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">{t("landing.faq3q")}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t("landing.faq3a")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner */}
      <section id="owner" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-[240px]">
                <img
                  src={SITE.secondaryPhoto.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="text-sm font-medium uppercase tracking-wide text-[var(--color-brand-primary)]">
                  {t("landing.ownerLabel")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
                  {PUBLIC_MARKETING.owner.name}
                </h2>
                <p className="mt-1 text-[var(--color-text-secondary)]">{PUBLIC_MARKETING.owner.title}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{t("landing.ownerBio")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social + Contact */}
      <section
        id="contact"
        className="scroll-mt-20 border-t border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl">
            {t("landing.contactTitle")}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-[var(--color-text-secondary)]">
            {t("landing.contactIntro")}
          </p>

          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="space-y-4 border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{t("landing.connectTitle")}</h3>
              <div className="flex flex-wrap gap-2">
                {social.youtube ? (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                  >
                    YouTube
                  </a>
                ) : null}
                {social.instagram ? (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                  >
                    Instagram
                  </a>
                ) : null}
                {social.x ? (
                  <a
                    href={social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
                  >
                    X
                  </a>
                ) : null}
                {!social.youtube && !social.instagram && !social.x ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">{t("landing.socialPlaceholderShort")}</p>
                ) : null}
              </div>
              <div className="space-y-2 border-t border-[var(--color-border-default)] pt-4 text-sm">
                <p className="text-[var(--color-text-primary)]">
                  <span className="font-medium">{t("landing.email")}: </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-[var(--color-brand-primary)] underline-offset-2 hover:underline"
                  >
                    {contact.email}
                  </a>
                </p>
                <p className="text-[var(--color-text-primary)]">
                  <span className="font-medium">{t("landing.phone")}: </span>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="font-medium text-[var(--color-brand-primary)] underline-offset-2 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </p>
                <p className="text-[var(--color-text-primary)]">
                  <span className="font-medium">{t("landing.address")}: </span>
                  {contact.address}
                </p>
              </div>
            </Card>

            <Card className="border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
              <h3 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">{t("landing.formTitle")}</h3>
              <form className="space-y-4" onSubmit={onContactSubmit} noValidate>
                <div className="hidden" aria-hidden="true">
                  <input tabIndex={-1} id="pub-company" name="company" type="text" autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="pub-name" className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">
                    {t("landing.formName")}
                  </label>
                  <input id="pub-name" name="name" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="pub-email" className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">
                    {t("landing.formEmail")}
                  </label>
                  <input id="pub-email" name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="pub-subject" className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">
                    {t("landing.formSubject")}
                  </label>
                  <input id="pub-subject" name="subject" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="pub-msg" className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">
                    {t("landing.formMessage")}
                  </label>
                  <textarea id="pub-msg" name="message" required rows={4} className={inputClass} />
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={formPhase === "submitting"}>
                  {formPhase === "submitting" ? t("landing.formSubmitting") : t("landing.formSubmit")}
                </Button>
                {formPhase === "success_api" ? (
                  <p className="text-sm text-[var(--color-success)]">{t("landing.formSuccessApi")}</p>
                ) : null}
                {formPhase === "success_mailto" ? (
                  <p className="text-sm text-[var(--color-success)]">{t("landing.formSent")}</p>
                ) : null}
                {formPhase === "error" && formError ? (
                  <p className="text-sm text-[var(--color-error)]">{formError}</p>
                ) : null}
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="safe-px border-t border-[var(--color-border-default)] py-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))] text-center text-sm text-[var(--color-text-secondary)]">
        © {new Date().getFullYear()} {SITE.name}. {t("landing.footer")}
      </footer>
    </div>
  );
}
