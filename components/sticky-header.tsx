'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header after scrolling past hero section (adjust 300 as needed)
      const shouldShow = window.scrollY > 300;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 z-50 transition-transform duration-300" 
         style={{ 
           transform: isVisible ? 'translateY(0)' : 'translateY(-100%)'
         }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Ready to start?
        </p>
        <Link href="/discover">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
            Start Your Journey
          </Button>
        </Link>
      </div>
    </div>
  );
} 