import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { BenefitsBar } from "@/components/benefits-bar"
import { PreviewSection } from "@/components/preview-section"
import { CategoryBanners } from "@/components/category-banners"
import { VideoCarousel } from "@/components/video-carousel"
import { ComfyLooksSection } from "@/components/comfy-looks-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroBanner />
      <BenefitsBar />
      <PreviewSection />
      <CategoryBanners />
      <VideoCarousel />
      <ComfyLooksSection title="Comfy Looks" />
      <ComfyLooksSection title="Comfy Looks" />
      <Footer />
    </main>
  )
}
