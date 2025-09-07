// Types for the digital Hitster game

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  releaseDate: string;
  year: number;
  uri: string;
  previewUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  tracks: Track[];
}

export interface GameState {
  playlists: Playlist[];
  allTracks: Track[];
  currentTrack: Track | null;
  usedTracks: Set<string>;
  isTrackInfoRevealed: boolean;
  gameMode: 'qr' | 'digital';
}

export interface SpotifyPlaylistResponse {
  id: string;
  name: string;
  tracks: {
    items: Array<{
      track: {
        id: string;
        name: string;
        artists: Array<{ name: string }>;
        album: {
          name: string;
          release_date: string;
        };
        uri: string;
        preview_url?: string;
      };
    }>;
    next: string | null;
  };
}