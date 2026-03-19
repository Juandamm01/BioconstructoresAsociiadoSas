"use client";

import Image from "next/image";

type EnvironmentCardProps = {
  image: string;
  rotation?: string;
};

export function EnvironmentCard({
  image,
  rotation = "",
}: EnvironmentCardProps) {
  return (
    <div
      className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${rotation} overflow-hidden`}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 z-20 bg-linear-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

      {/* Imagen de fondo */}
      <Image
        src={image}
        alt="BCAS environment"
        width={384}
        height={400}
        priority
        className="absolute inset-0 w-full h-full object-cover rounded-[2vw] border-[.5vw] border-background"
      />
    </div>
  );
}