import React, { useEffect, useRef, useState } from 'react';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

export default function PreviewWrapper({ children }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const containerWidth = wrapperRef.current.offsetWidth;
        const newScale = Math.min(containerWidth / A4_WIDTH, 1);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="page-wrapper" ref={wrapperRef}>
      <div
        className="page-container"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}
