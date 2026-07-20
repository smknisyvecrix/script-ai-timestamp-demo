import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TimestampSection } from "@/components/TimestampSection";
import { StatsSection } from "@/components/StatsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/app/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TimestampSection />
        <StatsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
