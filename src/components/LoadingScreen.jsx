import { useState, useEffect, useRef } from "react";
import "../css/LoadingScreen.css";
import { getCursorStyle } from "../utilities/cursors";
import startupCard from "../assets/images/startup-card-1.png";

const LoadingScreen = ({ progress: initialProgress, onSkip }) => {
  const [stage, setStage] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([
    "V8 JavaScript Engine v12.1, An Energy Star Ally",
    "Copyright (C) 1984-2025, Kaison Computer, Inc. ",
    "",
    "⠀",
    "",
    "",
    "Dependencies Check: ",
  ]);
  const [showCursor, setShowCursor] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSkipMessage, setShowSkipMessage] = useState(true);
  const lastTapRef = useRef(0);

  const hideCursor = () => {
    document.body.style.cursor = "none";
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        onSkip?.();
      }
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapRef.current;
      console.log("Touch detected", { currentTime, lastTap: lastTapRef.current, tapLength });
      
      if (tapLength < 600 && tapLength > 0) {
        console.log("Double-tap detected, onSkip:", typeof onSkip);
        onSkip?.();
      }
      lastTapRef.current = currentTime;
    };

    // Hide cursor when component mounts and keep it hidden
    hideCursor();
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("touchstart", handleTouchStart);
      // Don't restore cursor here - it will be restored when loading is completely done
    };
  }, [onSkip]);

  useEffect(() => {
    try {
      const platform = navigator.platform || "Unknown Platform";
      const userAgent = navigator.userAgent;
      const cpuCores = navigator.hardwareConcurrency || "Unknown";
      let cpuInfo = "Unknown CPU";

      if (userAgent.includes("Win")) {
        const cpuMatch = userAgent.match(/(?:Intel|AMD).+?(?=;|\))/i);
        cpuInfo = cpuMatch ? cpuMatch[0] : "x86 Compatible CPU";
      } else if (userAgent.includes("Mac")) {
        if (userAgent.includes("Intel")) {
          cpuInfo = "Intel CPU";
        } else if (userAgent.includes("Apple")) {
          cpuInfo = "Apple Silicon";
        }
      } else if (userAgent.includes("Linux")) {
        cpuInfo = "Linux CPU";
      } else if (userAgent.includes("Android")) {
        cpuInfo = "ARM CPU";
      } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        cpuInfo = "Apple CPU";
      }

      const platformLine = `${platform}(TM) Platform`;
      const cpuLine = `${cpuInfo} with ${cpuCores} Cores`;

      setDisplayedLines((prev) => {
        const newLines = [...prev];
        newLines[3] = platformLine;
        newLines[4] = cpuLine;
        return newLines;
      });
    } catch {
      setDisplayedLines((prev) => {
        const newLines = [...prev];
        newLines[4] = "FPT Platform (TM)";
        newLines[5] = "570GX CPU @ 1 Core";
        return newLines;
      });
    }
  }, []);

  useEffect(() => {
    const bootLines = [
      "  Detecting react ... @19.1.0 ",
      "  Detecting react-dom ... @19.1.0 ",
      "  Detecting vite ... @6.3.5 ",
      "  Detecting vitejs/plugin-react ... @4.4.1 ",
      "  Detecting eslint ... @9.25.0 ",
      "  Detecting gh-pages ... @6.3.0 ",
      "",
      "Starting Pane 97 ... ",
    ];
    const delays = [850, 650, 1200, 750, 900, 550, 1000, 800, 2000];

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 250);

    let timeoutId;
    const displayLines = async () => {
      for (let i = 0; i < bootLines.length; i++) {
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, delays[i]);
        });
        setDisplayedLines((prev) => [...prev, bootLines[i]]);
      }
      
      await new Promise((resolve) => {
        timeoutId = setTimeout(resolve, 2500);
      });
      
      setStage(1);
      
      await new Promise((resolve) => {
        timeoutId = setTimeout(resolve, 1500);
      });
      
      setProgress(0);
      setStage(2);
    };

    displayLines();

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (stage === 2) {
      setProgress(initialProgress);
    }
  }, [initialProgress, stage]);

  if (stage === 0) {
    return (
      <div className="loading-screen boot-mode">
        <div className="boot-sequence">
          {displayedLines.map((line, index) => (
            <div key={index} className="boot-line">
              {line}
              {index === displayedLines.length - 1 && (
                <span className={`cursor ${showCursor ? "visible" : "hidden"}`}>
                  _
                </span>
              )}
            </div>
          ))}
          {showSkipMessage && (
            <div className="boot-line skip-line">
              Press ESC or double-tap to skip starting sequence
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (stage === 1) {
    return (
      <div className="loading-screen boot-mode">
        <div className="boot-sequence">
          {showSkipMessage && (
            <div className="boot-line skip-line">
              Press ESC or double-tap to skip starting sequence
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="startup-card-container">
          <img src={startupCard} alt="Startup Card" className="startup-card" />
        </div>
        <div className="loading-status">
          <p className="loading-text">Starting up</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;