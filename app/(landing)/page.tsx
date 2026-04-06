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
        <AboutUs />
        <Services />
        <Plans />
        <Map />
        <Policy config={policyConfig} />
      </main>
      <Footer />
    </div>
  );
}
