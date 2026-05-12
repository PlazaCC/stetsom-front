import Faq from "./_components/faq";
import HeroCarousel from "./_components/hero-carousel";
import NossaHistoria from "./_components/nossa-historia";
import Novidades from "./_components/novidades";
import MidiasSociais from "./_components/social-medias";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Novidades />
      <NossaHistoria />
      <MidiasSociais />
      <Faq />
    </>
  );
}
