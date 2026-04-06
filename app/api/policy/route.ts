import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    let config = await (prisma as any).policyConfig.findUnique({ where: { id: 1 } });
    if (!config) {
      config = await (prisma as any).policyConfig.create({
        data: {
          id: 1,
          titulo: "Políticas ISP",
          texto: "BCAS ofrece a todos sus clientes servicios normativos que garantizan seguridad digital, responsabilidad social y cumplimiento legal en",
          resaltado: "Villavicencio.",
          videoUrl: "/videos/conectividad.mp4",
          b1Titulo: "Internet Sano",
          b1Texto: "Nos unimos a la campaña del Ministerio TIC para promover el uso seguro de Internet, generando conciencia sobre la prevención de la explotación infantil en entornos digitales.",
          b2Titulo: "Ley 679 de 2001",
          b2Texto: "Adoptamos medidas técnicas y administrativas para prevenir la difusión de contenido ilegal relacionado con menores de edad, implementando controles y filtros.",
          b3Titulo: "Ley 1336 de 2009",
          b3Texto: "Fortalecemos la protección de menores mediante códigos de conducta y políticas de prevención en servicios digitales para evitar la explotación sexual infantil.",
          b4Titulo: "Protección de Datos",
          b4Texto: "Garantizamos la confidencialidad de la información personal, aplicamos medidas de protección para prevenir fraude y accesos no autorizados."
        }
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error GET /api/policy:", error);
    return NextResponse.json({ error: "No se pudo obtener la configuración" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.json();
    
    const configLine = await (prisma as any).policyConfig.upsert({
      where: { id: 1 },
      update: {
        titulo: data.titulo,
        texto: data.texto,
        resaltado: data.resaltado,
        videoUrl: data.videoUrl,
        b1Titulo: data.b1Titulo,
        b1Texto: data.b1Texto,
        b2Titulo: data.b2Titulo,
        b2Texto: data.b2Texto,
        b3Titulo: data.b3Titulo,
        b3Texto: data.b3Texto,
        b4Titulo: data.b4Titulo,
        b4Texto: data.b4Texto,
      },
      create: {
        id: 1,
        titulo: data.titulo,
        texto: data.texto,
        resaltado: data.resaltado,
        videoUrl: data.videoUrl,
        b1Titulo: data.b1Titulo,
        b1Texto: data.b1Texto,
        b2Titulo: data.b2Titulo,
        b2Texto: data.b2Texto,
        b3Titulo: data.b3Titulo,
        b3Texto: data.b3Texto,
        b4Titulo: data.b4Titulo,
        b4Texto: data.b4Texto,
      }
    });

    return NextResponse.json({ success: true, data: configLine });
  } catch (error) {
    console.error("Error POST /api/policy:", error);
    return NextResponse.json({ error: "No se pudo guardar la configuración" }, { status: 500 });
  }
}
