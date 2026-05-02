import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { StickyFeatures } from "@/components/landing/sticky-features"
import { BentoVentajas } from "@/components/landing/bento-ventajas"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTAFinal } from "@/components/landing/cta-final"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="bg-white">
        <Hero />
        <StickyFeatures />
        <BentoVentajas />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
