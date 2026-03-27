import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const db = prisma as any;

export async function GET() {
  try {
    let config = await db.seccionServicios.findUnique({ where: { id: 1 } });
    if (!config) {
      config = await db.seccionServicios.create({
        data: { id: 1, title1: "Nuestros", title2: "Servicios" }
      });
    }

    const items = await db.itemServicio.findMany({
      orderBy: { order: "asc" }
    });

    return Response.json({ config, items });
  } catch (error) {
    console.error("API GET Error:", error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title1, title2 } = await req.json();
    const updated = await db.seccionServicios.upsert({
      where: { id: 1 },
      update: { title1, title2 },
      create: { id: 1, title1, title2 }
    });
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: "Failed to update config" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { id, ...payload } = data;

    if (id && id > 0) {
      const updated = await db.itemServicio.update({
        where: { id },
        data: payload
      });
      return Response.json(updated);
    } else {
      const created = await db.itemServicio.create({
        data: payload
      });
      return Response.json(created);
    }
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json({ error: "Failed to save item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");
    if (id) {
       await db.itemServicio.delete({ where: { id } });
       return Response.json({ success: true });
    }
    return Response.json({ error: "ID required" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
