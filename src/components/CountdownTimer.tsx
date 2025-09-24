import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  // Set the target date (example: 30 days from now) - moved outside effect to prevent re-creation
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Remove targetDate dependency since it's now stable

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'text-google-blue' },
    { label: 'Hours', value: timeLeft.hours, color: 'text-google-red' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'text-google-yellow' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'text-google-green' },
  ];

  return (
    <div className="fixed top-20 right-4 z-40 bg-card/90 backdrop-blur-lg border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-google-red" />
        <span className="text-sm font-semibold text-foreground">Applications Close In:</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="timer-digit rounded-lg p-3 text-center"
          >
            <div className={`text-2xl font-bold ${unit.color}`}>
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-xs text-muted-foreground">
          Don't miss out! Apply today
        </span>
      </div>
    </div>
  );
};