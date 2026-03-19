import {
  UpcomingEvents,
  Environments,
  Hero,
  Navbar,
  Phrase,
  Map,
  Footer,
} from "@/components/landing";
import { Policy } from "@/components/landing/policy";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <Environments />
        <UpcomingEvents />
        <Phrase />
        <Map />
        <Policy />
      </main>
      <Footer />
    </div>
  );
}
