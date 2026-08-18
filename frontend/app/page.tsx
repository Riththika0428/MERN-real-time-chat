import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero/hero';
import { Features } from '@/components/features';
import { CtaBand } from '@/components/cta-band';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <CtaBand />
      <Footer />
    </main>
  );
}