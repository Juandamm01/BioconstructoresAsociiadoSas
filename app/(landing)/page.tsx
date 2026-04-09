import {
  Services,
  AboutUs,
  Hero,
  Navbar,
  Plans,
  Map,
  Footer,
} from "@/components/landing";
import { Policy } from "@/components/landing/policy";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const aboutUsConfigRaw = await prisma.$queryRaw`SELECT * FROM "AboutUsConfig" WHERE id = 1 LIMIT 1` as any[];
  const dbConfig = aboutUsConfigRaw?.[0] || {};
  const aboutUsConfig = {
    titulo: dbConfig.titulo || "Nosotros",
    parrafo1: dbConfig.parrafo1 || "Somos un proveedor de servicios de Internet (ISP) comprometido con ofrecer conectividad estable, segura y de alta calidad. Nuestra misión es garantizar que hogares y empresas cuenten con un servicio confiable, soporte técnico oportuno y soluciones adaptadas a sus necesidades.",
    parrafo2: dbConfig.parrafo2 || "Nuestra infraestructura y enfoque tecnológico nos permiten brindar un servicio eficiente, con cobertura estratégica y atención personalizada. Conectamos personas, impulsamos negocios y acercamos oportunidades, fortaleciendo la transformación digital en Villavicencio y la región.",
    imagen1: dbConfig.imagen1 || "/images/bcas1.jpg",
    imagen2: dbConfig.imagen2 || "/images/bcas2.jpg",
    imagen3: dbConfig.imagen3 || "/images/bcas3.jpg",
    imagen4: dbConfig.imagen4 || "/images/bcas4.jpg"
  };

  const policyConfig = await (prisma as any).policyConfig.findUnique({ where: { id: 1 } }) || {
    titulo: "Políticas ISP",
    texto: "BCAS ofrece a todos sus clientes servicios normativos que garantizan seguridad digital, responsabilidad social y cumplimiento legal en",
    resaltado: "Villavicencio.",
    videoUrl: "/videos/conectividad.mp4"
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutUs config={aboutUsConfig} />
        <Services />
        <Plans />
        <Map />
        <Policy config={policyConfig} />
      </main>
      <Footer />
    </div>
  );
}
