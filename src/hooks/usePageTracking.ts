import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-YDKDTPWXKC", {
        page_path: location.pathname,
      });
    }
  }, [location]);
};

export default usePageTracking;
