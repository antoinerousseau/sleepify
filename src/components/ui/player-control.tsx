"use client"
import { useSleepify } from "@/context/sleepify-context"
import { useClickAway } from "@/hooks/useClickAway"
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useRef, useState } from "react"

export default function PlayerControl() {
  const {
    isPlaying,
    togglePlayPause,
    skipNext,
    skipPrevious,
    volume,
    setAudioVolume,
  } = useSleepify()
  const volumeRef = useRef<HTMLDivElement>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setAudioVolume(newVolume)
  }

  const toggleVolumeSlider = () => {
    setShowVolumeSlider((prev) => !prev)
  }

  const closeVolume = () => {
    setShowVolumeSlider(false)
  }

  useClickAway(volumeRef, closeVolume, showVolumeSlider)

  return (
    <div className="relative px-4">
      {/* Player Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={skipPrevious}
          aria-label="Skip to previous track"
          className="cursor-pointer"
        >
          <SkipBack />
        </button>
        <button
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause track" : "Play track"}
          className="cursor-pointer"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          onClick={skipNext}
          aria-label="Skip to next track"
          className="cursor-pointer"
        >
          <SkipForward />
        </button>

        {/* Volume Control */}
        <div className="relative translate-y-[3px]">
          <button
            onClick={toggleVolumeSlider}
            aria-label={volume === 0 ? "Unmute volume" : "Adjust volume"}
            className="cursor-pointer"
          >
            {volume === 0 ? <VolumeX /> : <Volume2 />}
          </button>
          {showVolumeSlider && (
            <div
              ref={volumeRef}
              className="brutal absolute bottom-full right-0 mb-2 w-32 bg-white p-2"
            >
              <label htmlFor="volume-slider" className="sr-only">
                Adjust volume
              </label>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={volume}
                aria-label="Volume slider"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
