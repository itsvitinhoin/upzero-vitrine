"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

interface VideoItem {
  id: number
  username: string
  description: string
}

const videos: VideoItem[] = [
  { id: 1, username: "Heliaelem Giessdael Aquino de...", description: "" },
  { id: 2, username: "Jaqueline Callege Aquino K...", description: "" },
  { id: 3, username: "Carmelita Vega Aquino Fer...", description: "" },
  { id: 4, username: "Melaneia Chocolladi Aquino X...", description: "" },
  { id: 5, username: "Carmelita Cora Aquino K...", description: "" },
  { id: 6, username: "Carmelita Cora Aquino K...", description: "" },
  { id: 7, username: "Carmelita Vega Aquino K...", description: "" },
]

export function VideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-white py-8">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors -ml-4"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          {/* Videos container */}
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video) => (
              <div key={video.id} className="flex-shrink-0 w-32 md:w-40">
                {/* Video thumbnail */}
                <div
                  className="relative aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden mb-2 cursor-pointer group"
                  onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                >
                  {/* Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-400" />
                  
                  {/* Play button overlay */}
                  {playingVideo !== video.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-full p-3">
                        <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                {/* User info */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0" />
                  <p className="text-[10px] text-gray-600 truncate">{video.username}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors -mr-4"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  )
}
