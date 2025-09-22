// hooks/useCustomCursor.ts
import { useEffect } from "react";
import { type UserStyle } from "../types/profile";

export const useCustomCursor = (parsedStyles: UserStyle | null) => {
  useEffect(() => {
    if (!parsedStyles) return;
    
    console.log("Parsed styles:", parsedStyles);

    let cursorEl = document.getElementById("custom-cursor");
    if (!cursorEl) {
      cursorEl = document.createElement("div");
      cursorEl.id = "custom-cursor";
      document.body.appendChild(cursorEl);
    }

    const width = Math.max(8, Number(parsedStyles.cursorWidth?.replace("px","")) || 24);
    const height = Math.max(8, Number(parsedStyles.cursorHeight?.replace("px","")) || 24);
    const scale = Math.max(0.1, Number(parsedStyles.cursorScale) || 1);

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
      backgroundSize: parsedStyles.customCursor ? "100% 100%" : "cover",
      borderRadius: parsedStyles.customCursor ? "0" : parsedStyles.cursorType === "circle" ? "50%" : "0",
      backgroundColor: parsedStyles.customCursor ? "transparent" : parsedStyles.cursorColor ?? "#000",
      boxShadow: parsedStyles.customCursor ? "none" : parsedStyles.cursorGlow ?? "none",
      backgroundImage: parsedStyles.customCursor ? `url(${parsedStyles.customCursor})` : "none",
    });

    const moveCursor = (e: MouseEvent) => {
      cursorEl!.style.left = e.clientX + "px";
      cursorEl!.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", moveCursor);

    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = "default";
      cursorEl?.remove();
    };
  }, [parsedStyles]);
};