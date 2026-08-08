import SaharaNavbar from "@/components/SaharaNavbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import StatsPreview from "@/components/StatsPreview";
import AIPreview from "@/components/AIPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SaharaNavbar />
      <Hero />
      <Services />
      <StatsPreview />
      <AIPreview />
      <Footer />
    </main>
  );
}