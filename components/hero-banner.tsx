"use client"

export function HeroBanner() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gray-200 overflow-hidden">
      {/* Placeholder for hero image */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200" />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-white max-w-xl">
            <p className="text-lg md:text-xl italic mb-2 text-gray-600">new drop</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wider mb-4 text-gray-700" style={{ fontFamily: 'serif' }}>
              CURADORIA
            </h2>
            <p className="text-sm md:text-base italic text-gray-600">
              confira o novo lançamento da coleção
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
