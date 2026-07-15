import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogContent } from "@/components/catalog-content"

export default function CatalogoPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CatalogContent />
      <Footer />
    </main>
  )
}
