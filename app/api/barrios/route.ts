import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const barrios = await prisma.barrio.findMany({
      orderBy: { id: "desc" },
    });
    return Response.json(barrios);
  } catch (error) {
    console.error("Error en GET /api/barrios:", error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // ── Verificar sesión ──────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
    // ─────────────────────────────────────────────────────

    const body = await req.json();

    if (!body.nombre) {
      return Response.json({ error: "Nombre requerido" }, { status: 400 });
    }

    let finalLat = body.lat ? Number(body.lat) : undefined;
    let finalLng = body.lng ? Number(body.lng) : undefined;

    // Si no mandan coordenadas manuales, intentamos usar Google Maps
    if (finalLat === undefined || finalLng === undefined || isNaN(finalLat) || isNaN(finalLng)) {
      const query = encodeURIComponent(`${body.nombre}, Villavicencio, Colombia`);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        return Response.json({ error: "Barrio no encontrado por Google, introduce coordenadas manuales." }, { status: 400 });
      }

      finalLat = data.results[0].geometry.location.lat;
      finalLng = data.results[0].geometry.location.lng;
    }

    // Verificar si ya existe
    const existe = await prisma.barrio.findFirst({
      where: { nombre: body.nombre },
    });

    if (existe) {
      return Response.json({ error: "El barrio ya existe" }, { status: 400 });
    }

    // Crear nuevo barrio con coordenadas
    const nuevo = await prisma.barrio.create({
      data: {
        nombre: body.nombre,
        lat: finalLat!,
        lng: finalLng!,
        color: body.color || "#2563eb", /* Blue default */
        radio: body.radio ? Number(body.radio) : 350, /* Default radius 350 instead of 300 */
      },
    });

    return Response.json(nuevo);
  } catch (error) {
    console.error("Error en POST /api/barrios:", error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}