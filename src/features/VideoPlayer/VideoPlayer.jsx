import React, { useState, useRef, useCallback, memo } from "react";
import "./VideoPlayer.css";
import treeIcon from "../../assets/icons/Tree.ico";

const VideoPlayer = memo(() => {
    const [videoSrc, setVideoSrc] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [aspectRatio, setAspectRatio] = useState("4/3");
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    React.useEffect(() => {
        return () => {
            if (videoSrc) {
                URL.revokeObjectURL(videoSrc);
            }
        };
    }, [videoSrc]);

    const handleImport = useCallback(() => {
        fileInputRef.current.click();
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const stopVideo = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, []);

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            const { videoWidth, videoHeight } = videoRef.current;
            if (videoWidth && videoHeight) {
                setAspectRatio(`${videoWidth}/${videoHeight}`);
            }
        }
    }, []);

    const handleSeek = useCallback((e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="video-player-container">
            <div className="video-area">
                <div
                    className="video-display-wrapper"
                    style={{ aspectRatio: videoSrc ? aspectRatio : "4/3" }}
                >
                    {videoSrc ? (
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onClick={togglePlay}
                            className="video-element"
                        />
                    ) : (
                        <div className="default-display">
                            <img src={treeIcon} alt="Default" className="center-icon" />
                        </div>
                    )}
                </div>
            </div>
            <div className="video-controls">
                <div className="seek-bar-section">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="seek-bar"
                    />
                </div>
                <div className="controls-bottom-row">
                    <div className="buttons-section">
                        <button onClick={togglePlay} className="window-button program-button">
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                        <button onClick={stopVideo} className="window-button program-button">
                            Stop
                        </button>
                        <button onClick={handleImport} className="window-button program-button">
                            Import
                        </button>
                    </div>
                    <div className="time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        style={{ display: "none" }}
                    />
                </div>
            </div>
        </div>
    );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
