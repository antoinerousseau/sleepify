import { Avatar, Count, LikedSongs } from "@/lib/types/definitions"
import { sql } from "@vercel/postgres"
import { cache } from "react"

const USER_ID = "410544b2-4001-4271-9855-fec4b6a6442a"

export const getUsersLikes = cache(async () => {
  try {
    const { rows } = await sql<LikedSongs>/*SQL*/ `
        SELECT 
            t.id AS track_id,
            t.name AS track_name,
            t.duration_ms,
            ARRAY_AGG(a.name) AS artists,
            t.image_url
        FROM 
            favorites f
        INNER JOIN 
            tracks t ON f.track_id = t.id
        INNER JOIN 
            track_artists ta ON t.id = ta.track_id
        INNER JOIN 
            artists a ON ta.artist_id = a.id
        WHERE 
            f.user_id = ${USER_ID} 
        GROUP BY 
            t.id, t.name, t.duration_ms
        ORDER BY 
            t.name
        `
    return rows
  } catch (error) {
    console.error("Error while getting users' liked songs: ", error)
    throw new Error("Failed to fetch users liked songs")
  }
})

export const getTotalLikes = cache(async (trackId: string) => {
  try {
    const { rows } = await sql<Count>/*SQL*/ `
        SELECT COUNT(*) AS total_likes
        FROM favorites
        WHERE track_id = ${trackId}`
    return rows
  } catch (error) {
    console.error("error while getting total counts: ", error)
    throw new Error("Error while fetching total likes")
  }
})

export const getAvatarFromUsers = cache(async (trackId: string) => {
  try {
    const { rows } = await sql<Avatar>/*SQL*/ `
        SELECT u.avatar
        FROM users u
        INNER JOIN favorites f ON u.id = f.user_id
        WHERE f.track_id = ${trackId}
        ORDER BY RANDOM()
        LIMIT 3;
        `
    return rows
  } catch (error) {
    console.error("Error while getting avatars from users", error)
    throw new Error("Failed to fetch avatar from users")
  }
})