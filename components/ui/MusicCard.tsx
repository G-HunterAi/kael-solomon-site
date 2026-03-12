import type { MusicTrack } from "@/data/music";

interface MusicCardProps {
  track: MusicTrack;
}

export default function MusicCard({ track }: MusicCardProps) {
  return (
    <div
      className="rounded-[2px] transition-shadow duration-200 ease-in-out cursor-pointer"
      style={{
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Artwork placeholder — always 1:1 */}
      {track.artworkImage ? (
        <div style={{ aspectRatio: "1/1", position: "relative" }}>
          {/* When artwork arrives, replace with next/image */}
          <div
            role="img"
            aria-label={`${track.title} artwork`}
            className="w-full h-full"
            style={{
              aspectRatio: "1/1",
              background: "var(--color-bg-subtle)",
            }}
          />
        </div>
      ) : (
        <div
          role="img"
          aria-label={`${track.title} — artwork coming soon`}
          className="w-full flex items-center justify-center"
          style={{
            aspectRatio: "1/1",
            background: "var(--color-bg-subtle)",
          }}
        >
          <span
            className="text-[11px] text-center px-3"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-inter)",
            }}
          >
            {track.title}
          </span>
        </div>
      )}

      {/* Card info */}
      <div className="p-4">
        <h3
          className="text-[16px] leading-[1.2] m-0 mb-1"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--color-text-primary)",
          }}
        >
          {track.title}
        </h3>

        {track.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {track.genres.map((genre) => (
              <span
                key={genre}
                className="text-[11px] px-2 py-0.5 rounded-[2px]"
                style={{
                  background: "var(--color-bg-subtle)",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <p
          className="text-[12px] m-0 mb-2"
          style={{
            color: "var(--color-text-faint)",
            fontFamily: "var(--font-inter)",
          }}
        >
          {track.year}
        </p>

        <div className="flex gap-3">
          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] no-underline transition-colors duration-150 ease-in-out"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Spotify ↗
            </a>
          )}
          {track.appleMusicUrl && (
            <a
              href={track.appleMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] no-underline transition-colors duration-150 ease-in-out"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-inter)",
              }}
            >
              Apple Music ↗
            </a>
          )}
          {track.youtubeUrl && (
            <a
              href={track.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] no-underline transition-colors duration-150 ease-in-out"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-inter)",
              }}
            >
              YouTube ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
