import Faq from "./_components/faq";
import Hero from "./_components/hero";
import NossaHistoria from "./_components/nossa-historia";
import Novidades from "./_components/novidades";
import MidiasSociais from "./_components/social-medias";

export default function Home() {
  return (
    <>
      <Hero />
      <Novidades />
      <NossaHistoria />
      <MidiasSociais />
      <Faq />
    </>
  );
}
