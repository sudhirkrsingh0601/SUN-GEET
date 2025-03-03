import React, { useState, useRef } from "react";

const Player = () => {
  const audioRef = useRef(new Audio("/music/song1.mp3"));
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <button onClick={togglePlay} className="play-icon">
        {isPlaying ? "⏸️" : "▶️"}
      </button>
    </div>
  );
};

export default Player;
