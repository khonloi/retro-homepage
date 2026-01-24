import React, { useState, useCallback, useEffect } from 'react';
import Desktop from './components/Desktop';
// import ScreensaverManager from './components/ScreensaverManager';
import { setCursorVariables } from './data/cursors';
import './App.css';

function App() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Initialize cursor variables on mount
  useEffect(() => {
    setCursorVariables();
  }, []);

  const handleFullScreenChange = useCallback((isFullScreenActive) => {
    setIsFullScreen(isFullScreenActive);
  }, []);

  return (
    <div className={`App ${isFullScreen ? 'fullscreen' : ''}`}>
      <Desktop onFullScreenChange={handleFullScreenChange} />
      {/* <ScreensaverManager /> */}
    </div>
  );
}

export default App;