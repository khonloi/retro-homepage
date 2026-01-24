import React, { useEffect, useRef, memo, useMemo, useCallback } from "react";
import p5 from "p5";
import hsIcon from "./hammer-sickle.png";
import hsIcon1 from "./hammer-sickle-1.png";
import hsIcon2 from "./hammer-sickle-2.png";
import hsIcon3 from "./hammer-sickle-3.png";
import hsIcon4 from "./hammer-sickle-4.png";
import hsIcon5 from "./hammer-sickle-5.png";
import starIcon from "./star.png";
import starIcon1 from "./star-1.png";
import starIcon2 from "./star-2.png";
import starIcon3 from "./star-3.png";
import starIcon4 from "./star-4.png";
import starIcon5 from "./star-5.png";
import "./StarShow.css";

// Constants for better maintainability
const WINDOWS_NUM = 500;
const SPEED = 4;
const MIN_SIZE = 4;
const MAX_SIZE = 26;

// Array of image paths to support multiple images
const IMAGE_PATHS = [
  hsIcon,
  hsIcon1,
  hsIcon2,
  hsIcon3,
  hsIcon4,
  hsIcon5,
  starIcon,
  starIcon1,
  starIcon2,
  starIcon3,
  starIcon4,
  starIcon5,
];

const StarShow = memo(() => {
  const sketchRef = useRef();
  const p5InstanceRef = useRef(null);

  // Memoize the sketch function to prevent recreation on every render
  const createSketch = useCallback(() => {
    return (p) => {
      let windows = [];
      let images = [];

      class Window {
        constructor() {
          this.reset();
          // Randomly assign an image from the loaded images
          this.img = images[Math.floor(p.random(images.length))];
        }

        reset() {
          this.x = p.random(-p.width, p.width);
          this.y = p.random(-p.height, p.height);
          this.z = p.random(p.width);
          this.pz = this.z;
        }

        update() {
          this.z = this.z - SPEED;
          if (this.z < 1) {
            this.z = p.width / 2;
            this.reset();
            // Reassign a random image when resetting
            if (images.length > 0) {
              this.img = images[Math.floor(p.random(images.length))];
            }
          }
        }

        show() {
          if (!this.img) return;
          const sx = p.map(this.x / this.z, 0, 1, 0, p.width / 2);
          const sy = p.map(this.y / this.z, 0, 1, 0, p.height / 2);
          const r = p.map(this.z, 0, p.width / 2, MAX_SIZE, MIN_SIZE);
          p.image(this.img, sx, sy, r, r);
          this.pz = this.z;
        }
      }

      p.setup = async () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        // Load all images from the IMAGE_PATHS array
        try {
          images = await Promise.all(
            IMAGE_PATHS.map(
              (path) =>
                new Promise((resolve, reject) => {
                  p.loadImage(path, resolve, (event) => reject(event));
                })
            )
          );
        } catch (error) {
          console.error("Failed to load images:", error);
          return;
        }

        // Initialize windows
        for (let i = 0; i < WINDOWS_NUM; i++) {
          windows[i] = new Window();
        }
      };

      p.draw = () => {
        if (images.length === 0) return; // Wait for images to load
        p.background(0);
        p.translate(p.width / 2, p.height / 2);
        
        // Use for loop for better performance
        for (let i = 0; i < windows.length; i++) {
          windows[i].update();
          windows[i].show();
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };
  }, []);

  useEffect(() => {
    const sketch = createSketch();
    p5InstanceRef.current = new p5(sketch, sketchRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [createSketch]);

  return <div ref={sketchRef} className="star-show-canvas" />;
});

StarShow.displayName = "StarShow";

export default StarShow;