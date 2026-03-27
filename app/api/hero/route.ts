import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    let hero = await prisma.heroConfig.findUnique({ where: { id: 1 } });
    if (!hero) {
      // Retornar valores por defecto si no están en la DB
      return Response.json({
        videoUrl: "/videos/hero1.mp4",
        bienvenido: "Bienvenido a",
        empresa: "Bioconstructores Asociados Sas",
        slogan: "Soluciones Innovadoras Para Un Mundo Conectado."
      });
    }
    return Response.json(hero);
  } catch (error) {
    console.error("Error en GET /api/hero:", error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await prisma.heroConfig.upsert({
      where: { id: 1 },
      update: {
        videoUrl: body.videoUrl,
        bienvenido: body.bienvenido,
        empresa: body.empresa,
        slogan: body.slogan
      },
      create: {
        id: 1,
        videoUrl: body.videoUrl,
        bienvenido: body.bienvenido,
        empresa: body.empresa,
        slogan: body.slogan
      }
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error en POST /api/hero:", error);
    return Response.json({ error: "Error al actualizar la configuración" }, { status: 500 });
  }
}
