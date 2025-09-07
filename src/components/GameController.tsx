import React, {useEffect, useState} from "react";
import { usePlayerDevice, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import QRCodeScanner from "@/components/QRCodeScanner";
import DigitalHitsterGame from "@/components/DigitalHitsterGame";
import Link from "next/link";
import { PlayButton } from "@/components/PlayButton";
import { ForwardButton } from "@/components/ForwardButton";
import { RewindButton } from "@/components/RewindButton";
import ProgressBar from "@/components/ProgressBar";
import NoSleep from 'nosleep.js';
import TriggeredTimeout from "@/components/TriggeredTimeout";

type Props = {
    token: string;
};

type GameMode = 'menu' | 'qr' | 'digital';

const hitsterMapping = {
    'de': {
        '00300': 'spotify:track:5IMtdHjJ1OtkxbGe4zfUxQ',
    }
}

export default function GameController({token}: Props) {
    const player = useSpotifyPlayer();
    const device = usePlayerDevice();
    const [gameMode, setGameMode] = useState<GameMode>('menu');
    const [showScanner, setShowScanner] = useState<boolean>(true);
    const [randomStart, setRandomStart] = useState<boolean>(false);
    const [showTriggeredTimeoutControls, setShowTriggeredTimeoutControls] = useState<boolean>(false);
    const [triggeredTimeoutTargetSeconds, setTriggeredTimeoutTargetSeconds] = useState<number>(30);
    const [triggeredTimeoutEnabledByDefault, setTriggeredTimeoutEnabledByDefault] = useState<boolean>(false);
    const [triggeredTimeoutSoundEnabled, setTriggeredTimeoutSoundEnabled] = useState<boolean>(false);

    useEffect(() => {
        if(!showScanner || gameMode === 'digital'){
            const noSleep = new NoSleep();
            noSleep.enable();
        }
    }, [showScanner, gameMode]);

    const handleQrResult = (trackId: string) => {
        setShowScanner(false);
        if (device === null) return;
        // set position to random value between 0 and 60 seconds
        let position = randomStart ? Math.floor(Math.random() * 60000): 0;

        fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${device?.device_id}`,
            {
                method: "PUT",
                body: JSON.stringify({uris: [`spotify:track:${trackId}`], 'position_ms': position}),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );
    }

    const goToNext = () => {
        player?.pause();
        setShowScanner(true);
    }

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode);
        if (mode === 'qr') {
            setShowScanner(true);
        }
    }

    const handleBackToMenu = () => {
        setGameMode('menu');
        setShowScanner(true);
        player?.pause();
    }

    if (device === null) return null;
    if (player === null) return null;

    const handleTriggeredTimeoutTriggered = () => {
        player?.pause();
    };

    // Digital Hitster Game Mode
    if (gameMode === 'digital') {
        return <DigitalHitsterGame token={token} onBackToMenu={handleBackToMenu} />;
    }

    // Game Mode Selection Menu
    if (gameMode === 'menu') {
        return (
            <div className="relative flex flex-col justify-center w-full min-h-screen bg-gradient-to-t from-purple-200 to-pink-200 px-4">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
                        <span className="text-indigo-500">Tune</span>Quest
                    </h1>
                    <p className="text-lg text-gray-700 mb-12">
                        Choose your game mode
                    </p>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => handleModeSelect('digital')}
                            className="w-full py-4 px-6 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg"
                        >
                            Digital Hitster
                            <div className="text-sm font-normal mt-1 opacity-90">
                                Play with your Spotify playlists
                            </div>
                        </button>
                        
                        <button
                            onClick={() => handleModeSelect('qr')}
                            className="w-full py-4 px-6 bg-purple-600 text-white font-bold text-lg rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg"
                        >
                            QR Code Mode
                            <div className="text-sm font-normal mt-1 opacity-90">
                                Scan QR codes from cards
                            </div>
                        </button>
                    </div>
                    
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // QR Code Mode (existing functionality)
    return (
        <div
            className="relative flex flex-col justify-around w-full min-h-screen bg-gradient-to-t from-purple-200 to-pink-200">
            {showScanner && (
                <>
                    <h1 className="fixed top-0 left-1/2 transform -translate-x-1/2 z-10 text-3xl font-bold tracking-tight text-white xs:text-4xl sm:text-5xl lg:text-6xl mt-8 uppercase text-center drop-shadow-lg">
                        Scan QR-Code
                    </h1>

                    <QRCodeScanner handleSpotifyTrackId={handleQrResult}/>

                    <div className="fixed flex w-full mb-4 bottom-0 left-1/2 transform -translate-x-1/2 z-20 px-4">
                        <button
                            onClick={handleBackToMenu}
                            className="text-center w-full rounded-md bg-white bg-opacity-70 px-3.5 py-2.5 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-opacity-10"
                        >
                            Back to Menu
                        </button>
                    </div>
                </>
            )}
            {!showScanner && (<>
                <div className="flex flex-col w-full sm:w-2/5 py-24 px-4 mx-auto flex-grow">
                    <h1 className="w-full text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-12">
                        <span className="text-indigo-500">Tune</span>Quest
                    </h1>
                    <div className="flex items-center mb-4">
                        <input type="checkbox"  id="randomStart" name="randomStart"  checked={randomStart} onChange={(event) => setRandomStart(event.target.checked)} className="w-4 h-4 rounded" />
                        <label htmlFor="randomStart" className="ms-2 text-sm font-medium"> Random start between 0 and 60s</label>
                    </div>
                    <div className="mb-8">
                        <ProgressBar/>
                    </div>
                    <div className="flex justify-around gap-x-6">
                        <RewindButton player={player} amount={10}/>
                        <PlayButton player={player}/>
                        <ForwardButton player={player} amount={10}/>
                    </div>
                    <div className="mt-16 flex w-full">
                        <button
                            className="w-full rounded-md bg-white bg-opacity-30 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-60"
                            onClick={() => goToNext()}
                        >
                            Scan Next Card
                        </button>
                    </div>
                    <div className="mt-4 flex w-full">
                        <button
                            onClick={handleBackToMenu}
                            className="w-full rounded-md bg-gray-500 bg-opacity-30 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-opacity-60"
                        >
                            Back to Menu
                        </button>
                    </div>
                    {showTriggeredTimeoutControls && (<>
                        <div>
                            <TriggeredTimeout
                                onTimeout={handleTriggeredTimeoutTriggered}
                                enabledByDefault={triggeredTimeoutEnabledByDefault}
                                setEnabledByDefault={setTriggeredTimeoutEnabledByDefault}
                                targetSeconds={triggeredTimeoutTargetSeconds}
                                setTargetSeconds={setTriggeredTimeoutTargetSeconds}
                                soundEnabled={triggeredTimeoutSoundEnabled}
                                setSoundEnabled={setTriggeredTimeoutSoundEnabled}
                            />
                        </div>
                    </>)}
                </div>
                <div className="mb-8 w-full text-center">
                    <button
                        onClick={() => setShowTriggeredTimeoutControls(!showTriggeredTimeoutControls)}
                    >
                        Toggle triggered timeout controls
                    </button>
                </div>
            </>)}
        </div>
    );
}