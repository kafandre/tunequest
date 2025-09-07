import { Track, Playlist, SpotifyPlaylistResponse } from '@/types/game';

export class SpotifyApiService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Extract playlist ID from Spotify URL or return the ID if already provided
   */
  extractPlaylistId(urlOrId: string): string | null {
    // Handle direct playlist ID
    if (urlOrId.match(/^[a-zA-Z0-9]+$/)) {
      return urlOrId;
    }

    // Handle Spotify URLs
    const urlPatterns = [
      /spotify:playlist:([a-zA-Z0-9]+)/,
      /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/
    ];

    for (const pattern of urlPatterns) {
      const match = urlOrId.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Fetch all tracks from a playlist (handles pagination)
   */
  async fetchPlaylistTracks(playlistId: string): Promise<Track[]> {
    const tracks: Track[] = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

    while (url) {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist tracks: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process tracks from this page
      for (const item of data.items) {
        if (item.track && item.track.id) {
          const track: Track = {
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists.map((artist: any) => artist.name).join(', '),
            album: item.track.album.name,
            releaseDate: item.track.album.release_date,
            year: new Date(item.track.album.release_date).getFullYear(),
            uri: item.track.uri,
            previewUrl: item.track.preview_url,
          };
          tracks.push(track);
        }
      }

      // Get next page URL
      url = data.next;
    }

    return tracks;
  }

  /**
   * Fetch playlist metadata and tracks
   */
  async fetchPlaylist(playlistIdOrUrl: string): Promise<Playlist> {
    const playlistId = this.extractPlaylistId(playlistIdOrUrl);
    
    if (!playlistId) {
      throw new Error('Invalid playlist URL or ID');
    }

    // Fetch playlist metadata
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!playlistResponse.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistResponse.statusText}`);
    }

    const playlistData = await playlistResponse.json();
    
    // Fetch all tracks
    const tracks = await this.fetchPlaylistTracks(playlistId);

    return {
      id: playlistId,
      name: playlistData.name,
      url: playlistIdOrUrl,
      tracks,
    };
  }

  /**
   * Fetch multiple playlists and return deduplicated tracks
   */
  async fetchMultiplePlaylists(playlistUrls: string[]): Promise<{ playlists: Playlist[], allTracks: Track[] }> {
    const playlists: Playlist[] = [];
    const trackMap = new Map<string, Track>();

    for (const url of playlistUrls) {
      try {
        const playlist = await this.fetchPlaylist(url);
        playlists.push(playlist);

        // Add tracks to map for deduplication
        for (const track of playlist.tracks) {
          if (!trackMap.has(track.id)) {
            trackMap.set(track.id, track);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch playlist ${url}:`, error);
        // Continue with other playlists even if one fails
      }
    }

    const allTracks = Array.from(trackMap.values());
    
    return { playlists, allTracks };
  }
}