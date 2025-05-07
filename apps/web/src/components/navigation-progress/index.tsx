'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const NavigationProgress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset progress when route changes
    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Complete progress after a short delay
    const timeout = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-[9999] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-primary transition-[width] duration-100 ease-out shadow-[0_0_10px_rgba(15,239,158,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default NavigationProgress;
