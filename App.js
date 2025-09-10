import React, { useEffect } from "react";
import { Linking, Platform } from "react-native";
import { AppProvider } from "./src/contexts/AppContext";
import AppNavigation from "./src/navigation/AppNavigation";

export default function App() {
  useEffect(() => {
    const handleDeepLink = (url) => {
      // Supabase automatically handles OAuth callbacks
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (
        window.location.hash.includes("access_token") ||
        window.location.pathname === "/auth/callback"
      ) {
        setTimeout(() => {
          if (window.location.hash) {
            window.history.replaceState(null, null, window.location.pathname);
          }
        }, 1000);
      }
    }

    if (Platform.OS !== "web") {
      const subscription = Linking.addEventListener("url", handleDeepLink);
      Linking.getInitialURL().then((url) => {
        if (url) handleDeepLink(url);
      });
      return () => subscription?.remove();
    }
  }, []);

  return (
    <AppProvider>
      <AppNavigation />
    </AppProvider>
  );
}
