import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import {
    CirclePlayDoticon,
    CirclePauseDoticon,
    BurgerDoticon,
    ArrowLeftDoticon,
    AlarmDoticon,
    GcalendarDoticon,
    CircleDotsDoticon,
    VolumeDoticon
} from "doticons/16";

export default function Watch() {
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("v") || '';
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [views, setViews] = useState<string | null>(null);
    const [uploadedAt, setUploadedAt] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Custom UI player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3001/video/${slug}`).then((response) => {
            setVideoUrl(response.data.video.videoUrl);
            setTitle(response.data.video.title);
            setDescription(response.data.video.description);
            setViews(response.data.video.views);
            setUploadedAt(response.data.video.uploadedAt);
        }).catch((err) => {
            console.log(err);
        })
    }, [slug]);

    const handlePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        const muted = !isMuted;
        setIsMuted(muted);
        videoRef.current.muted = muted;
    };
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "00:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-left w-full max-w-6xl mx-auto flex flex-col font-grotesk min-h-[80vh] py-4">
            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left/Main Column: Player */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Video Player Card */}
                    <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-[32px] p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                        <div className="relative w-full rounded-[24px] overflow-hidden aspect-video bg-black border border-black/5 shadow-inner group">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                src={videoUrl || undefined}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onTimeUpdate={(e) => {
                                    const video = e.currentTarget;
                                    if (video.duration) {
                                        setProgress((video.currentTime / video.duration) * 100);
                                        setCurrentTime(video.currentTime);
                                    }
                                }}
                                onClick={handlePlayPause}
                            />

                            {/* Simple overlay play prompt */}
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer" onClick={handlePlayPause}>
                                    <div className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:scale-105 transition-all">
                                        <CirclePlayDoticon className="w-8 h-8 text-black" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Custom Minimalism Control Bar */}
                        <div className="flex flex-col gap-3 bg-white/30 backdrop-blur-md border border-black/5 rounded-[20px] p-4">
                            {/* Progress bar */}
                            <div className="flex items-center gap-3">
                                <span className="font-lettera text-[10px] text-black/50 select-none">
                                    {formatTime(currentTime)}
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black hover:h-1.5 transition-all ease-in-out"
                                />
                                <span className="font-lettera text-[10px] text-black/50 select-none">
                                    {duration}
                                </span>
                            </div>

                            {/* Controls and Mute slider */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {/* Play/Pause Button */}
                                    <button
                                        onClick={handlePlayPause}
                                        className="flex items-center gap-2 px-5 py-2 bg-black text-white hover:bg-black/90 active:scale-95 transition-all rounded-full font-lettera uppercase text-xs tracking-wider cursor-pointer"
                                    >
                                        {isPlaying ? (
                                            <>
                                                <CirclePauseDoticon className="w-4 h-4 text-white" />
                                                <span>Pause</span>
                                            </>
                                        ) : (
                                            <>
                                                <CirclePlayDoticon className="w-4 h-4 text-white" />
                                                <span>Play</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Volume slider */}
                                <div className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full border border-black/5">
                                    <button
                                        onClick={toggleMute}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    >
                                        <VolumeDoticon className={`w-4 h-4 ${isMuted ? 'text-black/40' : 'text-black'}`} />
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-16 h-0.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information & Specs */}
                <div className="flex flex-col gap-6">
                    {/* Metadata Card */}
                    <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col text-left">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-2">NOW PLAYING</span>
                        <h1 className="font-ntype-headline text-2xl font-bold tracking-tight text-black mb-4 leading-tight">
                            {title || "Untitled Video"}
                        </h1>

                        {/* Specifications Panel (Nothing Style) */}
                        <div className="border border-black/5 rounded-[24px] bg-black/[0.02] p-4 flex flex-col gap-3 font-lettera text-xs text-black/80">
                            <span className="text-[10px] tracking-widest text-black/40 font-bold uppercase border-b border-black/5 pb-2 mb-1">SPECIFICATIONS</span>

                            <div className="flex items-center justify-between py-1 border-b border-black/[0.03]">
                                <div className="flex items-center gap-2 text-black/50">
                                    <CircleDotsDoticon className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">VIEWS</span>
                                </div>
                                <span className="font-lettera-medium text-black">{views !== null ? `${views} VIEWS` : "N/A"}</span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-black/[0.03]">
                                <div className="flex items-center gap-2 text-black/50">
                                    <AlarmDoticon className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">DURATION</span>
                                </div>
                                <span className="font-lettera-medium text-black">{duration || "N/A"}</span>
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2 text-black/50">
                                    <GcalendarDoticon className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider">PUBLISHED</span>
                                </div>
                                <span className="font-lettera-medium text-black uppercase">{uploadedAt || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col text-left">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-2">DESCRIPTION</span>
                        <div className="max-h-48 overflow-y-auto pr-2 font-grotesk text-sm leading-relaxed text-black/70 scrollbar-thin">
                            {description || "No description provided."}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
