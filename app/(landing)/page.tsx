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

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <Plans />
        <Map />
        <Policy />
      </main>
      <Footer />
    </div>
  );
}
