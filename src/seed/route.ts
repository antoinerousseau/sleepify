import { artists, trackArtists, tracks } from "@/lib/placeholder-data"
import { db } from "@vercel/postgres"

const client = await db.connect()

async function seedArtists() {
  await client.sql`DROP TABLE IF EXISTS track_artists CASCADE`
  await client.sql`DROP TABLE IF EXISTS artists CASCADE`
  await client.sql`
    CREATE TABLE IF NOT EXISTS artists (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL
    );
  `

  await Promise.all(
    artists.map(
      (artist) =>
        client.sql`
        INSERT INTO artists (id, name)
        VALUES (${artist.id}, ${artist.name})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  )
}

async function seedTracks() {
  await client.sql`DROP TABLE IF EXISTS tracks CASCADE`
  await client.sql`
    CREATE TABLE IF NOT EXISTS tracks (
      id VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      preview_url VARCHAR,
      duration_ms INTEGER,
      image_url VARCHAR
    );
  `

  await Promise.all(
    tracks.map(
      (track) =>
        client.sql`
        INSERT INTO tracks (id, name, preview_url, duration_ms, image_url)
        VALUES (${track.id}, ${track.name}, ${track.preview_url}, ${track.duration_ms}, ${track.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  )
}

async function seedTrackArtists() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS track_artists (
      track_id VARCHAR,
      artist_id VARCHAR,
      PRIMARY KEY (track_id, artist_id),
      FOREIGN KEY (track_id) REFERENCES tracks(id),
      FOREIGN KEY (artist_id) REFERENCES artists(id)
    );
  `

  await Promise.all(
    trackArtists.map(
      (ta) =>
        client.sql`
        INSERT INTO track_artists (track_id, artist_id)
        VALUES (${ta.track_id}, ${ta.artist_id})
        ON CONFLICT (track_id, artist_id) DO NOTHING;
      `,
    ),
  )
}

export async function GET() {
  try {
    await client.sql`BEGIN`
    await seedArtists()
    await seedTracks()
    await seedTrackArtists()
    await client.sql`COMMIT`

    return new Response(
      JSON.stringify({ message: "Database seeded successfully" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    await client.sql`ROLLBACK`
    return Response.json({ error }, { status: 500 })
  }
}
