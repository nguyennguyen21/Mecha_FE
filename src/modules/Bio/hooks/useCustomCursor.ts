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

    // Apply style từ JSON
    Object.assign(cursorEl.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: parsed.cursorWidth ?? "14px",
      height: parsed.cursorHeight ?? "14px",
      borderRadius: parsed.cursorType === "circle" ? "50%" : "0",
      backgroundColor: parsed.cursorColor ?? "#000",
      pointerEvents: "none", // không block click
      transform: "translate(-50%, -50%)",
      boxShadow: parsed.cursorGlow ?? "none",
      zIndex: "9999",
      fontSize: parsed.cursorFontSize ?? "14px",
      fontWeight: parsed.cursorFontWeight ?? "normal",
      mixBlendMode: "difference", // hiệu ứng blend đẹp
    });

    // Di chuyển theo chuột
    const moveCursor = (e: MouseEvent) => {
      cursorEl!.style.left = e.clientX + "px";
      cursorEl!.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", moveCursor);

    // Ẩn cursor gốc
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = "default";
      cursorEl?.remove();
    };
  }, [style]);
};
