"use client";
import { useEffect, useRef, useState } from "react";

interface Config {
  gravity: number;
  friction: number;
  imageSize: number;
  horizontalForce: number;
  verticalForce: number;
  rotationSpeed: number;
  resetDelay: number;
}

interface ParticleType {
  element: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  update: () => void;
}

const ExplosionContainer = () => {
  const explosionContainerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const particlesRef = useRef<ParticleType[]>([]);
  const hasExploded = useRef(false);

  const imageParticleCount = 8;
  const imagePaths = Array.from(
    { length: imageParticleCount },
    (_, i) => `/images/img${i + 1}.jpg`
  );

  useEffect(() => {
    const config: Config = {
      gravity: 0.25,
      friction: 0.99,
      imageSize: 150,
      horizontalForce: 20,
      verticalForce: 15,
      rotationSpeed: 10,
      resetDelay: 2000,
    };

    class Particle implements ParticleType {
      element: HTMLImageElement;
      x = 0;
      y = 0;
      vx: number;
      vy: number;
      rotation = 0;
      rotationSpeed: number;

      constructor(element: HTMLImageElement) {
        this.element = element;
        this.vx = (Math.random() - 0.5) * config.horizontalForce;
        this.vy = -config.verticalForce - Math.random() * 10;
        this.rotationSpeed =
          (Math.random() - 0.5) * config.rotationSpeed;
      }

      update() {
        this.vy += config.gravity;
        this.vx *= config.friction;
        this.vy *= config.friction;
        this.rotationSpeed *= config.friction;

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
      }
    }

    const createParticles = () => {
      const container = explosionContainerRef.current;
      if (!container) return;

      container.innerHTML = "";
      particlesRef.current = [];

      imagePaths.forEach((path) => {
        const particle = document.createElement("img");
        particle.src = path;
        particle.classList.add("explosion-particle-img");
        particle.style.width = `${config.imageSize}px`;
        container.appendChild(particle);
      });

      const elements = container.querySelectorAll<HTMLImageElement>(
        ".explosion-particle-img"
      );

      particlesRef.current = Array.from(elements).map(
        (el) => new Particle(el)
      );
    };

    const explode = () => {
      if (explosionTriggered || hasExploded.current) return;

      hasExploded.current = true;
      setExplosionTriggered(true);
      createParticles();

      let animationId: number;

      const animate = () => {
        particlesRef.current.forEach((p) => p.update());

        const container = explosionContainerRef.current;
        if (
          container &&
          particlesRef.current.every(
            (p) => p.y > container.offsetHeight / 2
          )
        ) {
          cancelAnimationFrame(animationId);
          setTimeout(() => setExplosionTriggered(false), config.resetDelay);
          return;
        }

        animationId = requestAnimationFrame(animate);
      };

      animate();
    };

    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });

    footerRef.current = document.querySelector("footer");
    createParticles();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) explode();
        });
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) observer.observe(footerRef.current);

    const handleResize = () => {
      hasExploded.current = false;
      setExplosionTriggered(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [explosionTriggered, imagePaths]);

  return <div ref={explosionContainerRef} className="explosion-container" />;
};

export default ExplosionContainer;