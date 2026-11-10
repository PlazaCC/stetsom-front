import { getTranslations } from "next-intl/server";
import { NotFoundState } from "@/components/ui/recovery-state";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <NotFoundState
      title={t("title")}
      description={t("description")}
      actionLabel={t("backHome")}
    />
  );
}
