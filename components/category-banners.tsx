"use client"

export function CategoryBanners() {
  return (
    <section className="bg-white py-4">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vestidos Banner */}
          <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden cursor-pointer group">
            {/* Placeholder background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 transition-transform duration-500 group-hover:scale-105" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-start p-8">
              <h3 className="text-3xl md:text-4xl font-light text-white tracking-widest italic" style={{ fontFamily: 'serif' }}>
                VESTIDOS
              </h3>
            </div>
          </div>

          {/* Revendedor Banner */}
          <div className="relative h-64 md:h-80 bg-[#8B7355] overflow-hidden cursor-pointer group">
            {/* Placeholder background with color */}
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-white text-lg mb-1">SEJA UM</p>
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                  REVENDEDOR
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
