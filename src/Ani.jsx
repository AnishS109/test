import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CountdownAnimation = () => {
  const countdownRef = useRef(null);
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      // Countdown Animation
      gsap.fromTo(
        countdownRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1.5, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );

      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white",
        fontWeight: "bold",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Countdown */}
      {count > 0 && (
        <div
          ref={countdownRef}
          style={{
            position: "absolute",
            fontSize: "8rem",
            textShadow: "0 0 20px #ffffff",
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
};

export default CountdownAnimation;
