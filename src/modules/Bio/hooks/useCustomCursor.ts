// hooks/useCustomCursor.ts
import { useEffect } from 'react';
import { type UserStyleRaw } from '../types/profile';
import { parseStyles } from '../utils/styleUtils';

export const useCustomCursor = (style: UserStyleRaw | null) => {
  useEffect(() => {
    const parsedStyles = parseStyles(style);
    if (parsedStyles?.cursorType) {
      document.body.style.cursor = parsedStyles.cursorType;
      return () => {
        document.body.style.cursor = 'default';
      };
    }
  }, [style]);
};