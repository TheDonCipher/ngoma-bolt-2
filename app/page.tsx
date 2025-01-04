import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedArtists } from "@/components/sections/featured-artists";
import { HowItWorks } from "@/components/sections/how-it-works";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedArtists />
      <HowItWorks />
    </main>
  );
}
