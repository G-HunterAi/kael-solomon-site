export interface MusicTrack {
  id: string;
  title: string;
  genres: string[];
  year: number;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  artworkImage?: string;
}

// No tracks at launch — music page renders holding state
export const musicTracks: MusicTrack[] = [];
