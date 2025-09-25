import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" };

const Scene = () => {
  const texture = useTexture(TEXTUREMAP.src);
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (texture) {
      setVisible(true);
    }
  }, [texture]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
    });
  }, [texture]);

  useFrame(({ clock, pointer }) => {
    // Add some simple rotation and scale animation
    if (meshRef.current) {
      // Animate opacity
      if (meshRef.current.material && "opacity" in meshRef.current.material) {
        (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
          THREE.MathUtils.lerp(
            (meshRef.current.material as THREE.MeshBasicMaterial).opacity,
            visible ? 0.8 : 0,
            0.05
          );
      }

      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      meshRef.current.scale.setScalar(scale);

      // Mouse interaction
      meshRef.current.position.x = pointer.x * 0.5;
      meshRef.current.position.y = pointer.y * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[4, 4]} />
    </mesh>
  );
};

export const HeroSection = () => {
  const titleWords = "Build Your Dreams".split(" ");
  const subtitle = "AI-powered creativity for the next generation.";
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <div className="h-screen relative overflow-hidden bg-background">
      <div className="h-screen uppercase items-center w-full absolute z-50 pointer-events-none px-10 flex justify-center flex-col">
        <div className="google-heading-1 text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold">
          <div className="z-0 flex space-x-2 lg:space-x-6 overflow-hidden text-foreground">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? "fade-in" : ""}
                style={{
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                  opacity: index < visibleWords ? undefined : 0,
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        <div className="google-heading-3 text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-2 overflow-hidden text-foreground font-bold">
          <div
            className={subtitleVisible ? "fade-in-subtitle" : ""}
            style={{
              animationDelay: `${
                titleWords.length * 0.13 + 0.2 + subtitleDelay
              }s`,
              opacity: subtitleVisible ? undefined : 0,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <button className="explore-btn" style={{ animationDelay: "2.2s" }}>
        Scroll to explore
        <span className="explore-arrow">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-svg"
          >
            <path
              d="M11 5V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 12L11 17L16 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
      </Canvas>
    </div>
  );
};
