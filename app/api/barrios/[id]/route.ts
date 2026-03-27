import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Verificar sesión ──────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }
    // ─────────────────────────────────────────────────────

    const { id } = await params;
    const barrioId = parseInt(id, 10);

    if (isNaN(barrioId)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const deleted = await prisma.barrio.delete({
      where: { id: barrioId },
    });

    return Response.json(deleted);
  } catch (error) {
    console.error("Error en DELETE /api/barrios/[id]:", error);
    return Response.json({ error: "Error eliminando el barrio" }, { status: 500 });
  }
}
