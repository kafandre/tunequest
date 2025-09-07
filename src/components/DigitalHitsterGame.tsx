import React, { useState } from 'react';
import { useDigitalGame } from '@/hooks/useDigitalGame';
import PlaylistInput from '@/components/PlaylistInput';
import DigitalGamePlay from '@/components/DigitalGamePlay';

interface DigitalHitsterGameProps {
  token: string;
  onBackToMenu: () => void;
}

type GamePhase = 'playlist-input' | 'playing';

export default function DigitalHitsterGame({ token, onBackToMenu }: DigitalHitsterGameProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('playlist-input');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const {
    gameState,
    isLoading,
    error,
    loadPlaylists,
    playRandomTrack,
    revealTrackInfo,
    markTrackAsUsed,
    resetGame,
    getGameStats,
  } = useDigitalGame(token);

  const handlePlaylistsSubmit = async (playlistUrls: string[]) => {
    setLoadingMessage('Loading playlists and removing duplicates...');
    
    const result = await loadPlaylists(playlistUrls);
    
    if (result.success) {
      setGamePhase('playing');
      setLoadingMessage('');
    }
    // Error handling is managed by the hook
  };

  const handleNextTrack = () => {
    markTrackAsUsed();
  };

  const handleBackToPlaylists = () => {
    resetGame();
    setGamePhase('playlist-input');
  };

  const handleBackToMenu = () => {
    resetGame();
    onBackToMenu();
  };

  if (gamePhase === 'playlist-input') {
    return (
      <div className="min-h-screen bg-gradient-to-t from-purple-200 to-pink-200 flex flex-col justify-center py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            <span className="text-indigo-500">Digital</span> Hitster
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto px-4">
            Create your own music guessing game! Add Spotify playlists and we'll create 
            a randomized game with no duplicate tracks.
          </p>
        </div>

        <PlaylistInput
          onPlaylistsSubmit={handlePlaylistsSubmit}
          isLoading={isLoading}
          error={error}
        />

        {loadingMessage && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">{loadingMessage}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleBackToMenu}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <DigitalGamePlay
      currentTrack={gameState.currentTrack}
      isTrackInfoRevealed={gameState.isTrackInfoRevealed}
      onPlayRandomTrack={playRandomTrack}
      onRevealTrackInfo={revealTrackInfo}
      onNextTrack={handleNextTrack}
      onBackToPlaylists={handleBackToPlaylists}
      gameStats={getGameStats()}
      token={token}
    />
  );
}