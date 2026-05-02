import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { StickyFeatures } from "@/components/landing/sticky-features"
import { VentajasSections } from "@/components/landing/ventajas-sections"
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
        <VentajasSections />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
