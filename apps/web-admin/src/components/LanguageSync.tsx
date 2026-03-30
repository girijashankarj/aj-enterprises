import { useEffect } from "react";
import i18n from "../i18n";
import { useAppSelector } from "../store/hooks";

export function LanguageSync() {
  const language = useAppSelector((s) => s.preferences.userOverrides.language ?? s.preferences.orgDefaults.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  return null;
}
