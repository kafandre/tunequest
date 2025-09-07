import React, { useState } from 'react';

interface PlaylistInputProps {
  onPlaylistsSubmit: (playlists: string[]) => void;
  isLoading: boolean;
  error: string | null;
}

export default function PlaylistInput({ onPlaylistsSubmit, isLoading, error }: PlaylistInputProps) {
  const [playlistUrls, setPlaylistUrls] = useState<string[]>(['']);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const addPlaylistInput = () => {
    setPlaylistUrls([...playlistUrls, '']);
  };

  const removePlaylistInput = (index: number) => {
    if (playlistUrls.length > 1) {
      const newUrls = playlistUrls.filter((_, i) => i !== index);
      setPlaylistUrls(newUrls);
    }
  };

  const updatePlaylistUrl = (index: number, value: string) => {
    const newUrls = [...playlistUrls];
    newUrls[index] = value;
    setPlaylistUrls(newUrls);
  };

  const validatePlaylistUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    
    // Check for Spotify playlist URL patterns
    const patterns = [
      /^[a-zA-Z0-9]+$/, // Direct playlist ID
      /spotify:playlist:[a-zA-Z0-9]+/, // Spotify URI
      /open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/ // Spotify URL
    ];

    return patterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = () => {
    const validUrls = playlistUrls.filter(url => url.trim());
    const errors: string[] = [];

    // Validate each URL
    validUrls.forEach((url, index) => {
      if (!validatePlaylistUrl(url)) {
        errors.push(`Playlist ${index + 1}: Invalid Spotify playlist URL or ID`);
      }
    });

    if (validUrls.length === 0) {
      errors.push('Please add at least one playlist');
    }

    setValidationErrors(errors);

    if (errors.length === 0) {
      onPlaylistsSubmit(validUrls);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
        Add Spotify Playlists
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Add Spotify playlist URLs or IDs. You can add multiple playlists - duplicate tracks will be automatically removed.
        </p>
        
        <div className="space-y-3">
          {playlistUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updatePlaylistUrl(index, e.target.value)}
                placeholder="https://open.spotify.com/playlist/... or playlist ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              {playlistUrls.length > 1 && (
                <button
                  onClick={() => removePlaylistInput(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                  disabled={isLoading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addPlaylistInput}
          className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          disabled={isLoading}
        >
          + Add another playlist
        </button>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <ul className="text-sm text-red-600 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* API Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Loading Playlists...
          </div>
        ) : (
          'Start Digital Hitster Game'
        )}
      </button>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold mb-1">Supported formats:</p>
        <ul className="space-y-1">
          <li>• Playlist URL: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M</li>
          <li>• Playlist URI: spotify:playlist:37i9dQZF1DXcBWIGoYBM5M</li>
          <li>• Playlist ID: 37i9dQZF1DXcBWIGoYBM5M</li>
        </ul>
      </div>
    </div>
  );
}