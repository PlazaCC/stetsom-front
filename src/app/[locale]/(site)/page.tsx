import { getCmsProvider } from "@/lib/api/provider";
import { getLocale } from "next-intl/server";
import { Faq } from "./_components/faq";
import { FeaturedProducts } from "./_components/featured-products";
import HeroCarousel from "./_components/hero-carousel";
import { OurHistory } from "./_components/our-history";
import { SocialFeed } from "./_components/social-feed";

export default async function Home() {
  const homePayload = await getCmsProvider().getSiteHomePayload(
    await getLocale(),
  );

  return (
    <>
      <HeroCarousel
        slides={homePayload.hero}
        config={homePayload.heroCarousel}
      />
      <FeaturedProducts
        featuredProducts={homePayload.featuredProducts}
        spotlightProduct={homePayload.spotlightProduct}
        tabs={homePayload.featuredTabs}
        section={homePayload.featured}
      />
      <OurHistory section={homePayload.history} />
      <SocialFeed section={homePayload.social} />
      <Faq items={homePayload.faq} section={homePayload.faqSection} />
    </>
  );
}
