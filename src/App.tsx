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

Mapbox.setAccessToken("sk.eyJ1IjoicGF0cmlja3RyYW4wNDgiLCJhIjoiY21lb3F5bWFlMWdmdDJxb2FwOHoydTZ3MyJ9.mjq39Yh-lW2gpm2xX0esAg");

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
