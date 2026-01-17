import { useState, useEffect, useRef } from "react";
import "../css/LoadingScreen.css";
import { getCursorStyle } from "../utilities/cursors";
import startupCard from "../assets/images/startup-card-1.png";

/**
 * Unified Loading/Shutdown Screen Component
 * @param {Object} props
 * @param {string} props.mode - 'loading' or 'shutdown'
 * @param {number} props.progress - Progress percentage (0-100) for loading mode
 * @param {Function} props.onSkip - Callback for skip action (loading mode)
 * @param {Function} props.onComplete - Callback for completion (shutdown mode)
 */
const LoadingScreen = ({
  mode = "loading",
  progress: initialProgress,
  onSkip,
  onComplete,
}) => {
  const [stage, setStage] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSkipMessage, setShowSkipMessage] = useState(true);
  const [showRestartMessage, setShowRestartMessage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const lastTapRef = useRef(0);

  // Initialize displayed lines based on mode
  const [displayedLines, setDisplayedLines] = useState(() => {
    if (mode === "shutdown") {
      return ["You can now close this browser tab "];
    }
    return [
      "V8 JavaScript Engine v12.4 - Energy Efficient Mode",
      "Copyright (C) 1984-2026 Kaison Computer Company",
      "",
      "⠀",
      "",
      "",
      "Running dependency verification "
    ];
  });

  // Preload the startup card image (only once on mount)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Even if image fails to load, allow the component to render
      setImageLoaded(true);
    };
    img.src = startupCard;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Common function to hide cursor
  const hideCursor = () => {
    document.body.style.cursor = "none";
  };

  // Common function to restore cursor
  const restoreCursor = () => {
    document.body.style.cursor = getCursorStyle("arrow");
  };

  // Handle keyboard and touch events
  useEffect(() => {
    if (mode === "shutdown") {
      const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          window.location.reload();
        }
      };

      hideCursor();
      const timer = setTimeout(() => {
        setShowRestartMessage(true);
        document.addEventListener("keydown", handleKeyPress);
      }, 1000);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyPress);
        restoreCursor();
      };
    } else {
      // Loading mode: handle ESC and double-tap
      const handleKeyPress = (event) => {
        if (event.key === "Escape") {
          onSkip?.();
        }
      };

      const handleTouchStart = (event) => {
        event.preventDefault();
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapRef.current;

        if (tapLength < 600 && tapLength > 0) {
          onSkip?.();
        }
        lastTapRef.current = currentTime;
      };

      hideCursor();
      document.addEventListener("keydown", handleKeyPress);
      document.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
        document.removeEventListener("touchstart", handleTouchStart);
        restoreCursor();
      };
    }
  }, [mode, onSkip]);

  // Platform detection (loading mode only)
  useEffect(() => {
    if (mode === "loading") {
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
        const cpuLine = `Detected: ${cpuInfo} @ ${cpuCores} Cores`;

        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[3] = platformLine;
          newLines[4] = cpuLine;
          return newLines;
        });
      } catch {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[4] = "Kaison FPT-9000 Series (TM) Platform";
          newLines[5] = "570GX Quantum Core @ 1 logical processor";
          return newLines;
        });
      }
    }
  }, [mode]);

  // Boot sequence animation (loading mode only)
  useEffect(() => {
    if (mode === "loading") {
      const bootLines = [
        "  React Stack ............ 19.1.0 [OK] ",
        "  DOM Renderer ........... 19.1.0 [OK] ",
        "  Vite Bundler ........... 6.3.5  [OK] ",
        "  Fast Refresh ........... 4.4.1  [OK] ",
        "  Linter Module .......... 9.25.0 [OK] ",
        "  Static Deploy Util ..... 6.3.0  [OK] ",
        "",
        "Starting GOMI 3 ... ",
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
    }
  }, [mode]);

  // Shutdown sequence timing
  useEffect(() => {
    if (mode === "shutdown") {
      setStage(0);

      setTimeout(() => {
        setStage(1);

        setTimeout(() => {
          setStage(2);
        }, 1500);
      }, 10000);
    }
  }, [mode]);

  // Progress update (loading mode only)
  useEffect(() => {
    if (mode === "loading" && stage === 2) {
      setProgress(initialProgress);
    }
  }, [initialProgress, stage, mode]);

  // Render based on mode and stage
  if (mode === "shutdown") {
    // Shutdown mode: Loading screen (stage 0) - wait for image to load
    if (stage === 0) {
      if (!imageLoaded) {
        return null; // Don't render until image is loaded
      }
      return (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="startup-card-container">
              <img
                src={startupCard}
                alt="Startup Card"
                className="startup-card"
              />
            </div>
            <div className="loading-status">
              <p className="loading-text">Shutting down</p>
            </div>
          </div>
        </div>
      );
    }

    // Shutdown mode: Black screen transition (stage 1)
    if (stage === 1) {
      return (
        <div className="loading-screen boot-mode">
          <div className="boot-sequence"></div>
        </div>
      );
    }

    // Shutdown mode: Shutdown sequence screen (stage 2)
    return (
      <div className="loading-screen boot-mode">
        <div className="boot-sequence">
          {displayedLines.map((line, index) => (
            <div key={index} className="boot-line">
              {line}
            </div>
          ))}
          {showRestartMessage && (
            <div className="boot-line skip-line">Press Enter to restart</div>
          )}
        </div>
      </div>
    );
  }

  // Loading mode: Boot sequence (stage 0)
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

  // Loading mode: Transition screen (stage 1)
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

  // Loading mode: Progress screen (stage 2) - wait for image to load
  if (!imageLoaded) {
    return null; // Don't render until image is loaded
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
