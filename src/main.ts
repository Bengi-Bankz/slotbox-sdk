import { setEngine } from "./app/getEngine";
import { LoadScreen } from "./app/screens/LoadScreen";
import { SlotMachineScreen } from "./app/screens/main/SlotMachineScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
// import "@esotericsoftware/spine-pixi-v8";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

// Make engine available globally for debugging and screenshot capture
(window as any).pixiApp = engine;

// Add screenshot capture function that captures full viewport
(window as any).captureScreenshot = (filename = 'slot-machine-screenshot') => {
  try {
    const canvas = engine.canvas;
    const link = document.createElement('a');
    link.download = `${filename}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    console.log('Screenshot captured successfully!');
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
  }
};

// Add debug function to log viewport info
(window as any).logViewportInfo = () => {
  console.log('=== Viewport Information ===');
  console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
  console.log('Engine screen dimensions:', engine.screen.width, 'x', engine.screen.height);
  console.log('Canvas dimensions:', engine.canvas.width, 'x', engine.canvas.height);
  console.log('Canvas style dimensions:', engine.canvas.style.width, 'x', engine.canvas.style.height);
  console.log('Device pixel ratio:', window.devicePixelRatio);
};

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: {
      minWidth: 280,  // Very small mobile screens
      minHeight: 480,  // Very small mobile screens
      letterbox: false
    },
  });

  // Initialize PixiJS DevTools in development mode
  if (import.meta.env.DEV) {
    try {
      console.log("Initializing PixiJS DevTools...");
      const { initDevtools } = await import("@pixi/devtools");
      initDevtools({
        app: engine,
      });
      console.log("PixiJS DevTools initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize PixiJS DevTools:", error);
    }
  }

  // Initialize the user settings
  userSettings.init();

  // Show the load screen
  await engine.navigation.showScreen(LoadScreen);
  // Show the slot machine screen once the load screen is dismissed
  await engine.navigation.showScreen(SlotMachineScreen);
})();
