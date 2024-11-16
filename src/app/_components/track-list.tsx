import TrackCard from "@/app/_components/track-card"
import { getTracks } from "../actions"

export default async function TrackList() {
  const tracks = await getTracks()

  return (
    <section className="mt-10 flex flex-col gap-4 sm:mt-24 lg:mt-32">
      <ul className="flex flex-col gap-4">
        {tracks.map((track) => (
          <TrackCard
            key={track.track_id}
            trackName={track.track_name}
            artistName={track.artist_name}
            trackImage={track.track_image}
            trackUrl={track.music_url}
          />
        ))}
      </ul>
    </section>
  )
}
