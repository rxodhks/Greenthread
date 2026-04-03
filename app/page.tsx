import { BusinessModel } from "@/components/greenthread/BusinessModel";
import { Footer } from "@/components/greenthread/Footer";
import { Header } from "@/components/greenthread/Header";
import { Hero } from "@/components/greenthread/Hero";
import { ScanExperience } from "@/components/greenthread/ScanExperience";
import { ThreadMap } from "@/components/greenthread/ThreadMap";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--gt-bg)] text-[var(--foreground)]">
      <Header />
      <Hero />
      <ScanExperience />
      <ThreadMap />
      <BusinessModel />
      <Footer />
    </div>
  );
}
