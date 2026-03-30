import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

export function ThemeSync() {
  const themeMode = useAppSelector((s) => s.theme.mode);
  useEffect(() => {
    const dark = themeMode === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [themeMode]);
  return null;
}
