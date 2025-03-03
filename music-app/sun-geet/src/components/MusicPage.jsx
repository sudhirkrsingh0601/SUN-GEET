import React, { useState, useRef, useEffect } from "react";
import "./MusicPage.css"; // Import CSS file

const songs = [
  { title: "Timeless", src: "/music/Timeless.mp3" },
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

  const audioRef = useRef(new Audio(currentSong.src));
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [currentSong]);

  const selectSong = (song) => {
    audioRef.current.pause();
    audioRef.current = new Audio(song.src);
    setCurrentSong(song);
    setProgress(0);
    setCurrentTime(0);

    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current.duration);
      if (isPlaying) {
        audioRef.current.play();
      }
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      startVisualizer();
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

  const startVisualizer = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audioRef.current);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    analyserRef.current = analyser;

    drawVisualizer();
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth / 2;
    canvas.height = 200;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const renderFrame = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(0, 0, 255)`; // Blue Equalizer Lines
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  return (
    <div className="container">
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
        {/* Equalizer Visualizer */}
        <canvas ref={canvasRef} className="visualizer"></canvas>

        {/* Play/Pause Button Below Equalizer */}
        <div className="player-controls">
          <button className="play-icon" onClick={togglePlay}>
            {isPlaying ? "⏸️" : "▶️"}
          </button>
        </div>

        {/* Progress Bar Below Equalizer */}
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
