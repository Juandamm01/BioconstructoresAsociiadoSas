import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // ── Verificar sessión ──────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    // ─────────────────────────────────────────────────────

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se encontró ningún archivo" }, { status: 400 });
    }

    // Solo permitir videos
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Solo se permiten archivos de video" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear carpeta si no existe
    const uploadDir = path.join(process.cwd(), "public", "videos");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignorar si ya existe
    }

    // Generar nombre único
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, filename);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Retornar la URL pública
    return NextResponse.json({ 
      success: true, 
      url: `/videos/${filename}` 
    });

  } catch (error) {
    console.error("Error en upload:", error);
    return NextResponse.json({ error: "Error interno al subir el archivo" }, { status: 500 });
  }
}
