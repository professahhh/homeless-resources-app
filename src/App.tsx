/**
 * React Native App
 * 
 *
 * @format
 */
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Mapbox from "@rnmapbox/maps";
import "@styles/globals.css";
import Tabs from "@/Tabs";
import { PortalProvider } from "@gorhom/portal";

// Get token from env
Mapbox.setAccessToken("");

export default function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
        <PortalProvider>
          <Tabs />
      </PortalProvider>
    </SafeAreaProvider>
  );
}
