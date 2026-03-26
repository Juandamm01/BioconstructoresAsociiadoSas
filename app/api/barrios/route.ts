import { prisma } from "@/lib/prisma";

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
    const body = await req.json();

    if (!body.nombre) {
      return Response.json({ error: "Nombre requerido" }, { status: 400 });
    }

    // Geocodificar barrio con Google Maps
    const query = encodeURIComponent(`${body.nombre}, Villavicencio, Colombia`);
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return Response.json({ error: "Barrio no encontrado" }, { status: 400 });
    }

    const location = data.results[0].geometry.location;

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
        lat: location.lat,
        lng: location.lng,
        color: body.color || "#2563EB",
        radio: body.radio || 300,
      },
    });

    return Response.json(nuevo);
  } catch (error) {
    console.error("Error en POST /api/barrios:", error);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}