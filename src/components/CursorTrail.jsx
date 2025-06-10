import React, { useEffect } from "react";

const CursorTrail = () => {
  useEffect(() => {
    const colors = ['#083753', '#084367', '#0E527B', '#1D6B9A', '#2C7CAC'];

    const handleMouseMove = (e) => {
      const trail = document.createElement("div");
      trail.classList.add("trail-dot");
      trail.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      trail.style.left = `${e.pageX - 3}px`; // half of 5px size to center
      trail.style.top = `${e.pageY - 3}px`;

      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 2000);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <style>{`
        .trail-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.8;
          animation: dropFade 2s forwards;
          z-index: 9999;
        }
        @keyframes dropFade {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100px) scale(0);
            opacity: 0;
          }
        }
      
      `}</style>
    </>
  );
};

export default CursorTrail;
