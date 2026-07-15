import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VarejoContent } from "@/components/varejo-content"

export default function VarejoPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={<div className="py-20 text-center text-gray-400">Carregando...</div>}>
        <VarejoContent />
      </Suspense>
      <Footer />
    </main>
  )
}
