import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CardsSection } from '@/components/CardsSection';
import { UnicornLoader } from '@/components/UnicornLoader';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <UnicornLoader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CountdownTimer />
      <div id="home">
        <HeroSection />
      </div>
      <div id="opportunities">
        <CardsSection />
      </div>
    </div>
  );
};

export default Index;
