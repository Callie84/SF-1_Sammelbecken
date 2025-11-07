import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.seedfinderpro.app",
  appName: "SeedFinder PRO",
  webDir: "../frontend/dist",
  bundledWebRuntime: false,
  server: { androidScheme: "https" }, // PWA-URLs bleiben gÃƒÂ¼ltig
  android: {
    allowMixedContent: false
  }
};
export default config;
