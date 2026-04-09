'use client';
import React, { useState, useEffect } from "react";

const loadingMessages: string[] = [
  "Brewing something amazing...",
  "Almost there, hang tight!",
  "Crafting your experience...",
  "Just a few more seconds...",
  "Loading the good stuff...",
  "Preparing something special...",
  "Working our magic...",
  "Getting everything ready...",
  "Almost done, promise!",
  "Putting the finishing touches..."
];

interface LoadingSpinnerProps {
  variant?: "default" | "ripple";
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState("");

  // Rotate messages every 2 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(messageInterval);
  }, []);

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "" : prev + "."));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

  const sizeClasses: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const containerSizeClasses: Record<string, string> = {
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
    xl: "p-16"
  };

  const displayMessage = message || loadingMessages[currentMessage];

  
  // Default variant
  return (
      <div
        className={`flex flex-col items-center justify-center ${containerSizeClasses[size]}`}
      >
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`absolute ${sizeClasses[size]} border-4 border-blue-500 rounded-full animate-ping`}
              style={{
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s"
              }}
            ></div>
          ))}
          <div
            className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-primary-600 rounded-full`}
          ></div>
        </div>
        <p className="mt-4 text-slate-600 text-sm font-medium text-center">
          {displayMessage}
          {dots}
        </p>
      </div>
    )
};

export default LoadingSpinner;
