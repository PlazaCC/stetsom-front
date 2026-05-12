import { getSiteHomePayload } from '@/lib/api/server'
import Faq from './_components/faq'
import HeroCarousel from './_components/hero-carousel'
import NossaHistoria from './_components/nossa-historia'
import NossasBases from './_components/nossas-bases'
import Novidades from './_components/novidades'
import MidiasSociais from './_components/social-medias'

export default async function Home() {
  const homePayload = await getSiteHomePayload()

  return (
    <>
      <HeroCarousel slides={homePayload.hero} />
      <Novidades
        featuredProducts={homePayload.featuredProducts}
        spotlightProduct={homePayload.spotlightProduct}
        tabs={homePayload.novidadesTabs}
        section={homePayload.novidades}
      />
      <NossaHistoria section={homePayload.history} />
      <NossasBases bases={homePayload.bases} />
      <MidiasSociais section={homePayload.social} />
      <Faq items={homePayload.faq} section={homePayload.faqSection} />
    </>
  )
}
