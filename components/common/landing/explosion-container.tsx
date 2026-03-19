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
  const hasExploded = useRef(false); // Evita múltiples disparos

  const config: Config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 150,
    horizontalForce: 20,
    verticalForce: 15,
    rotationSpeed: 10,
    resetDelay: 2000,
  };

  const imageParticleCount = 8;
  const imagePaths = Array.from(
    { length: imageParticleCount },
    (_, i) => `/images/img${i + 1}.jpg`
  );

  class Particle implements ParticleType {
    element: HTMLImageElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;

    constructor(element: HTMLImageElement) {
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.element) {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
      }
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

    const particleElements = container.querySelectorAll<HTMLImageElement>(
      ".explosion-particle-img"
    );
    particlesRef.current = Array.from(particleElements).map(
      (el) => new Particle(el)
    );
  };

  const explode = () => {
    if (explosionTriggered || hasExploded.current) return;
    hasExploded.current = true;
    setExplosionTriggered(true);
    createParticles();

    let animationId: number;
    let finished = false;

    const animate = () => {
      if (finished) return;
      particlesRef.current.forEach((particle) => particle.update());

      const container = explosionContainerRef.current;
      if (
        container &&
        particlesRef.current.every(
          (particle) => particle.y > container.offsetHeight / 2
        )
      ) {
        cancelAnimationFrame(animationId);
        finished = true;
        setTimeout(() => setExplosionTriggered(false), config.resetDelay);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
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
      { threshold: 0.3 } // cuando el footer está 30% visible
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
  }, []);

  return <div className="explosion-container" ref={explosionContainerRef}></div>;
};

export default ExplosionContainer;
