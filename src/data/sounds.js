/**
 * Centralized sound utility for playing audio files
 * Handles multiple path fallbacks for different environments
 */

/**
 * Play a sound file with multiple fallback paths
 * @param {string} soundType - The name of the sound file (without extension)
 * @param {Object} options - Optional configuration
 * @param {number} options.volume - Volume level (0-1), default 0.7
 * @param {boolean} options.preventDuplicate - Prevent playing if already playing, default false
 * @param {Audio} options.audioRef - Optional audio reference to track (for preventDuplicate)
 * @returns {Promise<void>}
 */
export const playSound = async (soundType, options = {}) => {
  const {
    volume = 0.7,
    preventDuplicate = false,
    audioRef = null
  } = options;

  // Prevent duplicate sound playing if requested
  if (preventDuplicate && audioRef?.current) {
    console.log('Sound already playing, not playing again');
    return;
  }

  // Get base URL for assets - handles both localhost and GitHub Pages
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Create array of possible sound paths with different formats and paths
  const audioSources = [
    `${baseUrl}sounds/${soundType}.mp3`,
    `/sounds/${soundType}.mp3`,
    `./sounds/${soundType}.mp3`,
    `../public/sounds/${soundType}.mp3`,
  ];

  // Create and configure audio element
  const audio = new Audio();
  audio.volume = volume;
  
  // Store reference if provided
  if (audioRef) {
    audioRef.current = audio;
  }
  
  // Try each source until one works
  for (const source of audioSources) {
    try {
      console.log(`Attempting to play ${soundType} audio from: ${source}`);
      audio.src = source;
      
      // Use a promise to handle the audio loading
      await new Promise((resolve, reject) => {
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
        audio.load();
      });
      
      // Play the audio with user interaction handling
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`${soundType} sound played successfully from: ${source}`);
        
        // Add an event listener to clear the audio reference when playback ends
        if (audioRef) {
          audio.onended = () => {
            console.log('Sound playback ended, clearing audio reference');
            audioRef.current = null;
          };
        }
        
        return; // Exit if successful
      }
    } catch (error) {
      console.warn(`Failed to play ${soundType} audio from ${source}:`, error);
      // Continue to next source
    }
  }
  
  console.error(`All ${soundType} audio sources failed to play`);
  if (audioRef) {
    audioRef.current = null;
  }
};

