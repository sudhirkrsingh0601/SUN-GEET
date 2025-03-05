import React, { useState, useRef, useEffect } from "react";
import "./MusicPage.css";

const songs = [
  { title: "Timeless", src: "/public/music/Timeless.mp3" },
  { title: "Blinding Lights", src: "/music/blinding_lights.mp3" },
  { title: "Uptown Funk", src: "/music/uptown_funk.mp3" },
  { title: "Someone Like You", src: "/music/someone_like_you.mp3" },
  { title: "Believer", src: "/music/believer.mp3" },
  { title: "Happier", src: "/music/happier.mp3" },
];

const MusicPage = () => {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;

    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / dataArrayRef.current.length;

      dataArrayRef.current.forEach((value, i) => {
        const barHeight = (value / 255) * canvas.height;
        ctx.fillStyle = `rgb(${value}, 100, 255)`;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
      });
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      audioContext.close();
    };
  }, []);

  const selectSong = (song) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.src;
      audioRef.current.load(); // Reload the new song
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(true);
      audioRef.current.play().catch((error) => console.log("Playback failed:", error));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.log("Playback failed:", error));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="container">
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={() => {
          setCurrentTime(audioRef.current.currentTime);
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Left Section - Song Selection */}
      <div className="left">
        <div className="header">
          <div className="music-icon">🎵</div>
          <h1 className="title">{currentSong.title}</h1>
        </div>
        <div className="grid">
          {songs.map((song, i) => (
            <button key={i} className="grid-item" onClick={() => selectSong(song)}>
              {song.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right Section - Music Player */}
      <div className="right">
        <canvas ref={canvasRef} className="visualizer"></canvas>

        {/* Play Button */}
        <div className="player-controls">
          <button className="play-icon" onClick={togglePlay}>
            {isPlaying ? "⏸️" : "▶️"}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="progress-bar"
            value={progress}
            onChange={handleSeek}
          />
          <span>{formatTime(duration - currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
