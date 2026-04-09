import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const raw = await prisma.$queryRaw`SELECT * FROM "AboutUsConfig" WHERE id = 1 LIMIT 1` as any[];
    let config = raw?.[0];
    if (!config) {
      await prisma.$executeRaw`
        INSERT INTO "AboutUsConfig" (id, titulo, parrafo1, parrafo2, imagen1, imagen2, imagen3, imagen4, "updatedAt") 
        VALUES (1, 'Nosotros', 'Somos un proveedor de servicios de Internet (ISP) comprometido con ofrecer conectividad estable, segura y de alta calidad. Nuestra misión es garantizar que hogares y empresas cuenten con un servicio confiable, soporte técnico oportuno y soluciones adaptadas a sus necesidades.', 'Nuestra infraestructura y enfoque tecnológico nos permiten brindar un servicio eficiente, con cobertura estratégica y atención personalizada. Conectamos personas, impulsamos negocios y acercamos oportunidades, fortaleciendo la transformación digital en Villavicencio y la región.', '/images/bcas1.jpg', '/images/bcas2.jpg', '/images/bcas3.jpg', '/images/bcas4.jpg', NOW())
      `;
      const newRaw = await prisma.$queryRaw`SELECT * FROM "AboutUsConfig" WHERE id = 1 LIMIT 1` as any[];
      config = newRaw?.[0];
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("Error GET /api/about:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { titulo, parrafo1, parrafo2, imagen1, imagen2, imagen3, imagen4 } = body;

    await prisma.$executeRaw`
      INSERT INTO "AboutUsConfig" (id, titulo, parrafo1, parrafo2, imagen1, imagen2, imagen3, imagen4, "updatedAt")
      VALUES (1, ${titulo}, ${parrafo1}, ${parrafo2}, ${imagen1}, ${imagen2}, ${imagen3}, ${imagen4}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        titulo = ${titulo},
        parrafo1 = ${parrafo1},
        parrafo2 = ${parrafo2},
        imagen1 = ${imagen1},
        imagen2 = ${imagen2},
        imagen3 = ${imagen3},
        imagen4 = ${imagen4},
        "updatedAt" = NOW()
    `;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error PUT /api/about:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
