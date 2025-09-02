// hooks/useCustomCursor.ts
import { useEffect } from "react";
import { type UserStyleRaw } from "../types/profile";
import { parseStyles } from "../utils/styleUtils";

export const useCustomCursor = (style: UserStyleRaw | null) => {
  useEffect(() => {
    const parsed = parseStyles(style);
    console.log("Style raw:", style);

    let cursorEl = document.getElementById("custom-cursor");
    if (!cursorEl) {
      cursorEl = document.createElement("div");
      cursorEl.id = "custom-cursor";
      document.body.appendChild(cursorEl);
    }

    const width = Math.max(8, Number(parsed.cursorWidth?.replace("px","")) || 24);
    const height = Math.max(8, Number(parsed.cursorHeight?.replace("px","")) || 24);
    const scale = Math.max(0.1, Number(parsed.cursorScale) || 1);

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
      backgroundSize: parsed.customCursor ? "100% 100%" : "cover",
      borderRadius: parsed.customCursor ? "0" : parsed.cursorType === "circle" ? "50%" : "0",
      backgroundColor: parsed.customCursor ? "transparent" : parsed.cursorColor ?? "#000",
      boxShadow: parsed.customCursor ? "none" : parsed.cursorGlow ?? "none",
      backgroundImage: parsed.customCursor ? `url(${parsed.customCursor})` : "none",
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
  }, [style]);
};
