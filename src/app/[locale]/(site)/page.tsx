import { getSiteHomePayload } from '@/lib/api/server';
import { Faq } from './_components/faq';
import { FeaturedProducts } from './_components/featured-products';
import HeroCarousel from './_components/hero-carousel';
import { OurHistory } from './_components/our-history';
import { SocialFeed } from './_components/social-feed';

export default async function Home() {
  const homePayload = await getSiteHomePayload();

  return (
    <>
      <HeroCarousel slides={homePayload.hero} />
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
