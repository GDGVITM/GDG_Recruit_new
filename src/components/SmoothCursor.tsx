import { useEffect, useRef } from "react";

export const SmoothCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef({
    mouseX: 0,
    mouseY: 0,
    destinationX: 0,
    destinationY: 0,
    distanceX: 0,
    distanceY: 0,
    key: -1,
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorFollower = cursorFollowerRef.current;
    if (!cursor || !cursorFollower) return;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      // Update cursor position
      if (cursor) {
        cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      // Update follower destination
      if (cursorFollower) {
        positionRef.current.destinationX =
          clientX - cursorFollower.offsetWidth / 2;
        positionRef.current.destinationY =
          clientY - cursorFollower.offsetHeight / 2;
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const followMouse = () => {
      positionRef.current.key = requestAnimationFrame(followMouse);

      const { destinationX, destinationY, distanceX, distanceY } =
        positionRef.current;

      positionRef.current.distanceX = (destinationX - distanceX) * 0.1;
      positionRef.current.distanceY = (destinationY - distanceY) * 0.1;

      positionRef.current.distanceX += distanceX;
      positionRef.current.distanceY += distanceY;

      if (cursorFollower) {
        cursorFollower.style.transform = `translate3d(${distanceX}px, ${distanceY}px, 0)`;
      }
    };

    followMouse();

    // Add hover effects
    const addHoverEffects = () => {
      const hoverElements = document.querySelectorAll(
        "a, button, [data-cursor-hover]"
      );

      const onMouseEnter = () => {
        if (cursorFollower && cursorRef.current) {
          cursorFollower.style.transform = "scale(1.5)";
          cursorFollower.style.borderColor = "rgba(255, 255, 255, 0.6)";
          cursorFollower.style.width = "40px";
          cursorFollower.style.height = "40px";
          if (cursorRef.current) {
            cursorRef.current.style.transform = "scale(1.5)";
            cursorRef.current.style.opacity = "0";
          }
        }
      };

      const onMouseLeave = () => {
        if (cursorFollower && cursorRef.current) {
          cursorFollower.style.transform = "scale(1)";
          cursorFollower.style.borderColor = "rgba(255, 255, 255, 0.3)";
          cursorFollower.style.width = "32px";
          cursorFollower.style.height = "32px";
          if (cursorRef.current) {
            cursorRef.current.style.transform = "scale(1)";
            cursorRef.current.style.opacity = "1";
          }
        }
      };

      hoverElements.forEach((element) => {
        element.addEventListener("mouseenter", onMouseEnter);
        element.addEventListener("mouseleave", onMouseLeave);
      });

      return () => {
        hoverElements.forEach((element) => {
          element.removeEventListener("mouseenter", onMouseEnter);
          element.removeEventListener("mouseleave", onMouseLeave);
        });
      };
    };

    const cleanupHover = addHoverEffects();

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(positionRef.current.key);
      cleanupHover();
    };
  }, []);

  // Add global styles to hide the default cursor
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-3 h-3 bg-white rounded-full pointer-events-none z-40 mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
      />
      <div
        ref={cursorFollowerRef}
        className="fixed w-8 h-8 border border-white/30 rounded-full pointer-events-none z-30 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
      />
    </>
  );
};

export default SmoothCursor;
