# TuneQuest - Digital Music Guessing Game

Welcome to TuneQuest, a digital music guessing game inspired by the board game Hitster! Test your music knowledge with friends using your own Spotify playlists.

## How to Play

**Digital Hitster Mode** (New!)
1. Add your favorite Spotify playlists
2. Click "Play Random Song" - a mystery track starts playing
3. Try to guess the year, artist, and song title
4. Click "Reveal Track Info" to see if you were right
5. Click "Next Song" to continue with a new random track

**QR Code Mode** (Original)
- Scan QR codes from physical Hitster cards to play tracks

## Quick Start (For Non-Techies)

### What You Need
- A computer with internet
- A **Spotify Premium account** (required!)
- 10-15 minutes to set up

### Step 1: Get the Code
1. Download this project as a ZIP file (click the green "Code" button → "Download ZIP")
2. Extract/unzip the folder to your Desktop

### Step 2: Set Up Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - **App Name**: "TuneQuest" (or any name you like)
   - **App Description**: "Music guessing game"
   - **Redirect URI**: `http://localhost:3000/player`
   - Check the boxes and click "Save"
5. Click on your new app, then "Settings"
6. Copy the **Client ID** and **Client Secret** (keep these safe!)

### Step 3: Configure the Game
1. In the TuneQuest folder, create a new file called `.env`
2. Copy and paste this into the file:
```
SPOTIFY_AUTHORIZE_URL=https://accounts.spotify.com/authorize
SPOTIFY_API_TOKEN_URL=https://accounts.spotify.com/api/token
SPOTIFY_REDIRECT_URI=http://localhost:3000/player
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_SCOPES=user-modify-playback-state streaming user-read-email user-read-private
NEXT_PUBLIC_TUNEQUEST_CREATE_URL=http://localhost:5173
```
3. Replace `your_client_secret_here` and `your_client_id_here` with the values from Step 2

### Step 4: Install and Run
1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org) (choose the LTS version)
2. **Open Terminal/Command Prompt**:
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter
3. **Navigate to the game folder**:
   ```
   cd Desktop/TuneQuest-main
   ```
4. **Install the game**:
   ```
   npm install
   ```
5. **Start the game**:
   ```
   npm run dev
   ```
6. **Open your browser** and go to: `http://localhost:3000`

### Step 5: Play!
1. Click "Play the Game"
2. Log in with your Spotify account
3. Choose "Digital Hitster" mode
4. Add your playlist URLs (copy from Spotify app)
5. Start guessing!

## Important Notes

- **Spotify Premium Required**: The game only works with Spotify Premium accounts due to API limitations
- **Browser Autoplay**: The first song might not play automatically - just click the play button
- **Legal Notice**: Using Spotify API for games may be against their terms of service - use at your own risk

## Features

- **Digital Hitster Mode**: Play with your own Spotify playlists  
- **Automatic Deduplication**: No duplicate songs across multiple playlists  
- **Random Track Selection**: Never play the same song twice in a session  
- **Track Information Reveal**: Show year, artist, and song name  
- **QR Code Mode**: Compatible with physical Hitster cards  
- **Progress Tracking**: See how many songs you've played  

## Troubleshooting

**"Can't connect to Spotify"**
- Make sure you have Spotify Premium
- Check that your Client ID and Client Secret are correct
- Ensure Spotify app is running on your device

**"Songs won't play"**
- Open Spotify app on your computer/phone
- Make sure you're logged into the same account
- Try refreshing the browser page

**"Invalid playlist URL"**
- Copy the playlist URL directly from Spotify
- Make sure the playlist is public or you own it
- Try using just the playlist ID instead of the full URL

## For Developers

### Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables
Create a `.env` file with:
```env
SPOTIFY_AUTHORIZE_URL=https://accounts.spotify.com/authorize
SPOTIFY_API_TOKEN_URL=https://accounts.spotify.com/api/token
SPOTIFY_REDIRECT_URI=http://localhost:3000/player
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_SCOPES=user-modify-playback-state streaming user-read-email user-read-private
NEXT_PUBLIC_TUNEQUEST_CREATE_URL=http://localhost:5173
```

## Docker

Build the docker image:
```bash
docker build -t tunequest .
```

Create the following `docker-compose.yaml` file:
```yaml
services:
  tunequest:
    container_name: tunequest
    image: tunequest
    restart: unless-stopped
    ports:
      - 3000:3000
    environment:
      SPOTIFY_AUTHORIZE_URL: https://accounts.spotify.com/authorize
      SPOTIFY_API_TOKEN_URL: https://accounts.spotify.com/api/token
      SPOTIFY_REDIRECT_URI: http://localhost:3000/player
      SPOTIFY_CLIENT_SECRET: xxx
      SPOTIFY_CLIENT_ID: xxx
      SPOTIFY_SCOPES: user-modify-playback-state streaming user-read-email user-read-private
      TUNEQUEST_CREATE_URL: http://localhost:5173
```

Run the docker image with docker compose:
```bash
docker-compose up -d
```

## TODO
- [ ] Add compatibility with original Hitster cards
- [ ] Improve error handling and user feedback
- [ ] Add game statistics and scoring
- [ ] Docker deployment improvements