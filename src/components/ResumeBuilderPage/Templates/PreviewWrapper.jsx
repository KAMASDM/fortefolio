import { useLayoutEffect, useRef, useState } from "react";

// One scaling system shared by the editor, live preview and public page.
export default function PreviewWrapper({ children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [size, setSize] = useState({ scale: 1, height: 1123 });
  useLayoutEffect(() => {
    const measure = () => {
      const scale = Math.min((outer.current?.clientWidth || 794) / 794, 1);
      const height = inner.current?.scrollHeight || 1123;
      setSize((previous) =>
        previous.scale === scale && previous.height === height
          ? previous
          : { scale, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer.current);
    observer.observe(inner.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={outer}
      className="page-wrapper"
      style={{
        display: "block",
        width: "100%",
        height: size.height * size.scale,
        position: "relative",
      }}
    >
      <div
        ref={inner}
        className="scaled-resume"
        style={{
          width: 794,
          position: "absolute",
          left: "50%",
          marginLeft: -397,
          transform: `scale(${size.scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
