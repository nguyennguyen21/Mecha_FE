// hooks/useCustomCursor.ts
import { useEffect } from "react";
import { type UserStyleRaw } from "../types/profile";
import { parseStyles } from "../utils/styleUtils";

export const useCustomCursor = (style: UserStyleRaw | null) => {
  useEffect(() => {
    const parsed = parseStyles(style);

    // Tạo div cursor nếu chưa có
    let cursorEl = document.getElementById("custom-cursor");
    if (!cursorEl) {
      cursorEl = document.createElement("div");
      cursorEl.id = "custom-cursor";
      document.body.appendChild(cursorEl);
    }

    const width = parseInt(parsed.cursorWidth ?? "24", 10);
    const height = parseInt(parsed.cursorHeight ?? "24", 10);
    const scale = parseFloat(parsed.cursorScale ?? "1"); // scale thêm

    // Apply style từ JSON
    Object.assign(cursorEl.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: width * scale + "px",
      height: height * scale + "px",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      zIndex: "9999",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "contain",
    });

    if (parsed.customCursor) {
      cursorEl.style.backgroundImage = `url(${parsed.customCursor})`;
      cursorEl.style.borderRadius = "0";
      cursorEl.style.backgroundColor = "transparent";
      cursorEl.style.boxShadow = "none";
    } else {
      cursorEl.style.backgroundImage = "none";
      cursorEl.style.borderRadius =
        parsed.cursorType === "circle" ? "50%" : "0";
      cursorEl.style.backgroundColor = parsed.cursorColor ?? "#000";
      cursorEl.style.boxShadow = parsed.cursorGlow ?? "none";
    }

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
