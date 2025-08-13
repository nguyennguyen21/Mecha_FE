import React from "react";
import type { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode; 
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default Background;
