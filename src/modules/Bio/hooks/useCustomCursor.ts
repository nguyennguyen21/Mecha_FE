// hooks/useCustomCursor.ts
import { useEffect } from "react";
import { type UserStyle } from "../types/profile";

export const useCustomCursor = (parsedStyles: UserStyle | null) => {
  useEffect(() => {
    // Check if custom cursor is configured
    const hasCustomCursor = parsedStyles?.customCursor && parsedStyles.customCursor.trim() !== "";
    
    // Only hide default cursor and show custom cursor if custom cursor is set
    if (!hasCustomCursor) {
      // Restore default cursor if no custom cursor
      document.body.style.cursor = "default";
      
      // Hide custom cursor element if it exists
      const cursorEl = document.getElementById("custom-cursor");
      if (cursorEl) {
        cursorEl.style.display = "none";
      }
      return;
    }

    // Hide default cursor only when custom cursor is active
    document.body.style.cursor = "none";
    
    // Initialize or get cursor element
    let cursorEl = document.getElementById("custom-cursor");
    if (!cursorEl) {
      cursorEl = document.createElement("div");
      cursorEl.id = "custom-cursor";
      document.body.appendChild(cursorEl);
    }

    // Use parsedStyles if available, otherwise use defaults
    // Note: width, height, and scale calculations are prepared but not currently used

    // Use custom cursor image
    const cursorImage = parsedStyles.customCursor;

    // Apply cursor styles
    Object.assign(cursorEl.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: 35 + "px",
      height: 35 + "px",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      zIndex: "9999",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
      borderRadius: "0",
      backgroundColor: "transparent",
      boxShadow: "none",
      backgroundImage: `url(${cursorImage})`,
      opacity: "1",
      display: "block",
    });

    // Mouse move handler
    const moveCursor = (e: MouseEvent) => {
      if (cursorEl) {
        cursorEl.style.left = e.clientX + "px";
        cursorEl.style.top = e.clientY + "px";
      }
    };
    
    document.addEventListener("mousemove", moveCursor);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      // Restore default cursor on cleanup
      document.body.style.cursor = "default";
    };
  }, [parsedStyles]);
};