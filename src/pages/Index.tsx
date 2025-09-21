import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PopularDestinations from "@/components/PopularDestinations";
import TripGeniePreview from "@/components/TripGeniePreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PopularDestinations />
      <TripGeniePreview />
      <Footer />
    </main>
  );
};

export default Index;
