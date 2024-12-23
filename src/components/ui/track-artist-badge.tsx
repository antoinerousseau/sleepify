import { TrackList } from "@/lib/types/definitions"
import Image from "next/image"

type Props = Pick<TrackList, "track_image" | "track_name" | "artist_name">

export default function TrackArtistBadge({
  track_image: trackImage = "../../../public/cover-album_placeholder.webp",
  track_name: trackName = "Unknown track",
  artist_name: artistName = ["Unknown artist"],
}: Props) {
  return (
    <figure className="flex items-center">
      <div className="relative w-12 sm:w-16">
        <Image
          src={trackImage}
          alt={`Album cover of ${trackName} by ${artistName}`}
          width={640}
          height={640}
          className="rounded-full border border-black"
        />
      </div>
      <figcaption className="ml-4">
        <h3 className="text-xs font-bold sm:text-base">{trackName}</h3>
        <div className="text-2xs sm:text-xs">{artistName}</div>
      </figcaption>
    </figure>
  )
}
