import { CTASection } from "@/features/landing/components/CTASection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
import { Footer } from "@/features/landing/components/Footer";
import { HeroSection } from "@/features/landing/components/HeroSection";

export default function IndexPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-20 py-12 lg:py-16">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
