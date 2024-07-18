import React, { useEffect, useRef, useState } from "react";

import styles from "./ImageSlider.module.scss";
import { images } from "./data";

const ImageSlider = () => {
  const timer = useRef(null);
  const [currentImageSerialNo, setCurrentImageSerialNo] = useState(1);

  useEffect(() => {
    slidingAnimation();
  });

  const slidingAnimation = () => {
    timer.current = setTimeout(() => {
      setCurrentImageSerialNo((prev) => {
        if (prev === 3) return 1;
        return prev + 1;
      });
    }, [5000]);
    return () => clearTimeout(timer.current);
  };

  const pauseSliding = () => {
    clearInterval(timer.current);
  };

  const playSliding = () => {
    if (timer.current) clearInterval(timer.current);
    slidingAnimation();
  };

  const slideImage = () => {
    return {
      transform: `translateX(-${(currentImageSerialNo - 1) * 101}%)`,
    };
  };

  const changeDotColor = (currentDotSerialNo) => {
    return {
      backgroundColor:
        currentImageSerialNo === currentDotSerialNo + 1
          ? `var(--white)`
          : `var(--extraSecondary)`,
    };
  };

  return (
    <>
      <div
        className={`${styles.imageSliderContainer}`}
        onMouseEnter={pauseSliding}
        onMouseLeave={playSliding}
      >
        <div className={`${styles.imageSliderWrapper}`} style={slideImage()}>
          {images.map((image, idx) => (
            <img
              key={idx}
              src={image.source}
              alt={image.alt}
              className={`${styles.imageStyling}`}
            />
          ))}
        </div>
        <div className={`${styles.dotsContainer}`}>
          {images.map((_, idx) => {
            return (
              <div
                key={idx}
                className={`${styles.dot} ${
                  idx + 1 === currentImageSerialNo
                    ? styles["animate-increase-width"]
                    : null
                }`}
                style={changeDotColor(idx)}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
