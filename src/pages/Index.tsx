import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CardsSection } from "@/components/CardsSection";
import { Loader } from "@/components/Loader";
import { Footer } from "@/components/Footer";
import SmoothCursor from "@/components/SmoothCursor";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [preSelectedPosition, setPreSelectedPosition] = useState<string>("");

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleOpenFormWithPosition = (position?: string) => {
    if (position) {
      setPreSelectedPosition(position);
    }
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <Loader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background cursor-none">
      <SmoothCursor />
      <Navbar
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        preSelectedPosition={preSelectedPosition}
        clearPreSelectedPosition={() => setPreSelectedPosition("")}
      />
      <div id="home">
        <HeroSection />
        {/* Countdown Timer positioned below hero */}
        <div className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8">
          <CountdownTimer />
        </div>
      </div>
      <div id="opportunities">
        <CardsSection onOpenForm={handleOpenFormWithPosition} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
