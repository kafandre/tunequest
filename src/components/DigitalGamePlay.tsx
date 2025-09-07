import React, { useEffect, useState } from 'react';
import { usePlayerDevice, useSpotifyPlayer } from 'react-spotify-web-playback-sdk';
import { Track } from '@/types/game';
import { PlayButton } from '@/components/PlayButton';
import { ForwardButton } from '@/components/ForwardButton';
import { RewindButton } from '@/components/RewindButton';
import ProgressBar from '@/components/ProgressBar';

interface DigitalGamePlayProps {
  currentTrack: Track | null;
  isTrackInfoRevealed: boolean;
  onPlayRandomTrack: () => Track | null;
  onRevealTrackInfo: () => void;
  onNextTrack: () => void;
  onBackToPlaylists: () => void;
  gameStats: {
    totalTracks: number;
    usedTracks: number;
    remainingTracks: number;
    playlistCount: number;
  };
  token: string;
}

export default function DigitalGamePlay({
  currentTrack,
  isTrackInfoRevealed,
  onPlayRandomTrack,
  onRevealTrackInfo,
  onNextTrack,
  onBackToPlaylists,
  gameStats,
  token
}: DigitalGamePlayProps) {
  const player = useSpotifyPlayer();
  const device = usePlayerDevice();
  const [randomStart, setRandomStart] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Play the track when a new track is selected
  useEffect(() => {
    if (currentTrack && device && player) {
      playTrack(currentTrack);
    }
  }, [currentTrack, device, player]);

  const playTrack = async (track: Track) => {
    if (!device || !player) return;

    try {
      // Set position to random value between 0 and 60 seconds if enabled
      const position = randomStart ? Math.floor(Math.random() * 60000) : 0;

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ 
            uris: [track.uri], 
            position_ms: position 
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePlayRandomTrack = () => {
    const track = onPlayRandomTrack();
    if (track) {
      setIsPlaying(false); // Will be set to true when track starts playing
    }
  };

  const handleNextTrack = () => {
    player?.pause();
    setIsPlaying(false);
    onNextTrack();
  };

  if (!device || !player) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Spotify...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-full min-h-screen bg-gradient-to-t from-purple-200 to-pink-200">
      {/* Header */}
      <div className="pt-8 px-4">
        <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          <span className="text-indigo-500">Digital</span> Hitster
        </h1>
        
        {/* Game Stats */}
        <div className="text-center text-sm text-gray-700 mb-6">
          <p>
            {gameStats.usedTracks} / {gameStats.totalTracks} tracks played 
            ({gameStats.remainingTracks} remaining)
          </p>
          <p className="text-xs text-gray-600">
            From {gameStats.playlistCount} playlist{gameStats.playlistCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="w-full max-w-md mx-auto">
          
          {/* Track Info Display */}
          {currentTrack && (
            <div className="mb-8 p-6 bg-white bg-opacity-80 rounded-lg shadow-lg">
              {isTrackInfoRevealed ? (
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">{currentTrack.name}</h2>
                  <p className="text-lg text-gray-700">{currentTrack.artist}</p>
                  <p className="text-md text-gray-600">{currentTrack.album}</p>
                  <p className="text-2xl font-bold text-indigo-600">{currentTrack.year}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-4">🎵 Track is playing...</p>
                  <p className="text-sm text-gray-500">
                    Can you guess the year, artist, and song?
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <input 
                type="checkbox" 
                id="randomStart" 
                name="randomStart" 
                checked={randomStart} 
                onChange={(event) => setRandomStart(event.target.checked)} 
                className="w-4 h-4 rounded" 
              />
              <label htmlFor="randomStart" className="ml-2 text-sm font-medium text-gray-700">
                Random start (0-60s)
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {currentTrack && (
            <div className="mb-6">
              <ProgressBar />
            </div>
          )}

          {/* Playback Controls */}
          {currentTrack && (
            <div className="flex justify-center gap-4 mb-8">
              <RewindButton player={player} amount={10} />
              <PlayButton player={player} />
              <ForwardButton player={player} amount={10} />
            </div>
          )}

          {/* Game Action Buttons */}
          <div className="space-y-4">
            {!currentTrack ? (
              <button
                onClick={handlePlayRandomTrack}
                disabled={gameStats.remainingTracks === 0}
                className="w-full py-4 px-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gameStats.remainingTracks === 0 ? 'No More Tracks!' : '🎲 Play Random Song'}
              </button>
            ) : !isTrackInfoRevealed ? (
              <button
                onClick={onRevealTrackInfo}
                className="w-full py-4 px-6 bg-yellow-600 text-white font-bold text-lg rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                👁️ Reveal Track Info
              </button>
            ) : (
              <button
                onClick={handleNextTrack}
                disabled={gameStats.remainingTracks === 0}
                className="w-full py-4 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gameStats.remainingTracks === 0 ? 'Game Complete!' : '⏭️ Next Song'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 px-4">
        <button
          onClick={onBackToPlaylists}
          className="w-full py-3 px-4 bg-white bg-opacity-70 text-gray-900 font-semibold rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          ← Back to Playlist Selection
        </button>
      </div>
    </div>
  );
}