import { useEffect } from "react";
import { pageTitle } from "../config/site";

export function usePageTitle(segment: string) {
  useEffect(() => {
    document.title = pageTitle(segment);
  }, [segment]);
}
