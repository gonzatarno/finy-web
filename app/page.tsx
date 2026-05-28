import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { StickyFeatures } from "@/components/landing/sticky-features"
import { AIShowcase } from "@/components/landing/ai-showcase"
import { VentajasSections } from "@/components/landing/ventajas-sections"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { Contact } from "@/components/landing/contact"
import { CTAFinal } from "@/components/landing/cta-final"
import { Footer } from "@/components/landing/footer"
import { StickyDownloadBar } from "@/components/landing/sticky-download-bar"

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="bg-white">
        <Hero />
        <StickyFeatures />
        <AIShowcase />
        <VentajasSections />
        <Pricing />
        <FAQ />
        <Contact />
        <CTAFinal />
      </main>
      <Footer />
      <StickyDownloadBar />
    </>
  )
}
