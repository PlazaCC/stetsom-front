export function BrFlag() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="16" height="12" rx="1" fill="#009C3B" />
      <path d="M8 1.5L14.5 6L8 10.5L1.5 6L8 1.5Z" fill="#FEDF00" />
      <circle cx="8" cy="6" r="2.4" fill="#002776" />
    </svg>
  );
}

export function UsFlag() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="16" height="12" rx="1" fill="#B22234" />
      <rect y="0.923" width="16" height="0.923" fill="white" />
      <rect y="2.769" width="16" height="0.923" fill="white" />
      <rect y="4.615" width="16" height="0.923" fill="white" />
      <rect y="6.462" width="16" height="0.923" fill="white" />
      <rect y="8.308" width="16" height="0.923" fill="white" />
      <rect y="10.154" width="16" height="0.923" fill="white" />
      <rect width="7" height="6.462" rx="0" fill="#3C3B6E" />
      <circle cx="1.2" cy="1.2" r="0.5" fill="white" />
      <circle cx="2.4" cy="1.2" r="0.5" fill="white" />
      <circle cx="3.6" cy="1.2" r="0.5" fill="white" />
      <circle cx="4.8" cy="1.2" r="0.5" fill="white" />
      <circle cx="6" cy="1.2" r="0.5" fill="white" />
      <circle cx="1.8" cy="2.4" r="0.5" fill="white" />
      <circle cx="3" cy="2.4" r="0.5" fill="white" />
      <circle cx="4.2" cy="2.4" r="0.5" fill="white" />
      <circle cx="5.4" cy="2.4" r="0.5" fill="white" />
      <circle cx="1.2" cy="3.6" r="0.5" fill="white" />
      <circle cx="2.4" cy="3.6" r="0.5" fill="white" />
      <circle cx="3.6" cy="3.6" r="0.5" fill="white" />
      <circle cx="4.8" cy="3.6" r="0.5" fill="white" />
      <circle cx="6" cy="3.6" r="0.5" fill="white" />
      <circle cx="1.8" cy="4.8" r="0.5" fill="white" />
      <circle cx="3" cy="4.8" r="0.5" fill="white" />
      <circle cx="4.2" cy="4.8" r="0.5" fill="white" />
      <circle cx="5.4" cy="4.8" r="0.5" fill="white" />
      <circle cx="1.2" cy="5.8" r="0.5" fill="white" />
      <circle cx="2.4" cy="5.8" r="0.5" fill="white" />
      <circle cx="3.6" cy="5.8" r="0.5" fill="white" />
      <circle cx="4.8" cy="5.8" r="0.5" fill="white" />
      <circle cx="6" cy="5.8" r="0.5" fill="white" />
    </svg>
  );
}

export function EsFlag() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="16" height="12" rx="1" fill="#AA151B" />
      <rect y="3" width="16" height="6" fill="#F1BF00" />
    </svg>
  );
}

export type FlagLocale = "pt-BR" | "en" | "es";

export function LocaleFlag({ locale }: { locale: FlagLocale }) {
  if (locale === "pt-BR") return <BrFlag />;
  if (locale === "en") return <UsFlag />;
  return <EsFlag />;
}
