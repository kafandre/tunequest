import { useState, useCallback, useMemo } from 'react';
import { Track, GameState } from '@/types/game';
import { SpotifyApiService } from '@/utils/spotifyApi';

export const useDigitalGame = (token: string) => {
  const [gameState, setGameState] = useState<GameState>({
    playlists: [],
    allTracks: [],
    currentTrack: null,
    usedTracks: new Set(),
    isTrackInfoRevealed: false,
    gameMode: 'digital',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spotifyApi = useMemo(() => new SpotifyApiService(token), [token]);

  /**
   * Load playlists and prepare the game
   */
  const loadPlaylists = useCallback(async (playlistUrls: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const { playlists, allTracks } = await spotifyApi.fetchMultiplePlaylists(playlistUrls);
      
      if (allTracks.length === 0) {
        throw new Error('No tracks found in the provided playlists');
      }

      setGameState(prev => ({
        ...prev,
        playlists,
        allTracks,
        usedTracks: new Set(),
        currentTrack: null,
        isTrackInfoRevealed: false,
      }));

      return { success: true, trackCount: allTracks.length };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load playlists';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [spotifyApi]);

  /**
   * Get a random track that hasn't been used yet
   */
  const getRandomTrack = useCallback((): Track | null => {
    const availableTracks = gameState.allTracks.filter(
      track => !gameState.usedTracks.has(track.id)
    );

    if (availableTracks.length === 0) {
      return null; // No more tracks available
    }

    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    return availableTracks[randomIndex];
  }, [gameState.allTracks, gameState.usedTracks]);

  /**
   * Start playing a random track
   */
  const playRandomTrack = useCallback(() => {
    const randomTrack = getRandomTrack();
    
    if (!randomTrack) {
      setError('No more tracks available in the game');
      return null;
    }

    setGameState(prev => ({
      ...prev,
      currentTrack: randomTrack,
      isTrackInfoRevealed: false,
    }));

    return randomTrack;
  }, [getRandomTrack]);

  /**
   * Reveal the current track information
   */
  const revealTrackInfo = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isTrackInfoRevealed: true,
    }));
  }, []);

  /**
   * Mark current track as used and prepare for next track
   */
  const markTrackAsUsed = useCallback(() => {
    if (gameState.currentTrack) {
      setGameState(prev => {
        const newUsedTracks = new Set(prev.usedTracks);
        newUsedTracks.add(prev.currentTrack!.id);
        return {
          ...prev,
          usedTracks: newUsedTracks,
          currentTrack: null,
          isTrackInfoRevealed: false,
        };
      });
    }
  }, [gameState.currentTrack]);

  /**
   * Reset the game state
   */
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentTrack: null,
      usedTracks: new Set(),
      isTrackInfoRevealed: false,
    }));
    setError(null);
  }, []);

  /**
   * Get game statistics
   */
  const getGameStats = useCallback(() => {
    return {
      totalTracks: gameState.allTracks.length,
      usedTracks: gameState.usedTracks.size,
      remainingTracks: gameState.allTracks.length - gameState.usedTracks.size,
      playlistCount: gameState.playlists.length,
    };
  }, [gameState]);

  return {
    gameState,
    isLoading,
    error,
    loadPlaylists,
    playRandomTrack,
    revealTrackInfo,
    markTrackAsUsed,
    resetGame,
    getGameStats,
  };
};