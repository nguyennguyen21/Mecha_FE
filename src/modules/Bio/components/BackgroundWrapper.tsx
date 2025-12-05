import type { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  return (
      <div
        style={{
          background: "#fff", 
          width: "500px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          padding: "20px",
        }}
      >
        {children}
      </div>
  );
};

export default BackgroundWrapper;
