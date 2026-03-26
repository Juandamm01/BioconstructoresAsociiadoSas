-- CreateTable
CREATE TABLE "Barrio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "radio" INTEGER NOT NULL,

    CONSTRAINT "Barrio_pkey" PRIMARY KEY ("id")
);
