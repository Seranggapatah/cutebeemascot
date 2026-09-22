/*
  Load cute_bee.riv
  Artboard: Artboard
  ViewModel enum: state
*/

import "./styles.css";
import { Fit, Rive, Layout } from "@rive-app/webgl2";

interface EnumProperty {
  value: string;
  values?: string[];
}

interface ViewModelInstance {
  enum(name: string): EnumProperty;
}

const STATE_ENUMS = [
  "bravo",
  "congrat",
  "cry",
  "idle",
  "idle2",
  "idleTalk",
] as const;

const layout = new Layout({
  fit: Fit.Contain,
});

const riveCanvas = document.getElementById("rive-canvas") as HTMLCanvasElement;
const stateButtons = document.getElementById(
  "state-buttons",
) as HTMLDivElement;

const riveSrc = new URL("./cute_bee.riv", import.meta.url).href;

const logDebug = (
  label: string,
  message: string,
  data?: unknown,
): void => {
  const time = new Date().toLocaleTimeString();
  if (data !== undefined) {
    console.log(`[${time}] [${label}] ${message}`, data);
    return;
  }
  console.log(`[${time}] [${label}] ${message}`);
};

const setActiveButton = (value: string): void => {
  stateButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.state === value);
  });
};

const r = new Rive({
  src: riveSrc,
  canvas: riveCanvas,
  artboard: "Artboard",
  stateMachines: "State Machine 1",
  layout,
  autoplay: true,
  autoBind: true,
  onLoad: (): void => {
    logDebug("Rive", "cute_bee.riv loaded");
    r.resizeDrawingSurfaceToCanvas();

    const vmi = r.viewModelInstance as ViewModelInstance | null;
    if (!vmi) {
      console.error("ViewModel instance not available");
      return;
    }

    let stateProperty: EnumProperty | null = null;
    try {
      stateProperty = vmi.enum("state");
    } catch (error) {
      console.error('Failed to bind ViewModel enum "state":', error);
    }

    if (!stateProperty) {
      console.error('ViewModel enum "state" not found');
      return;
    }

    const enumValues =
      stateProperty.values && stateProperty.values.length > 0
        ? stateProperty.values
        : [...STATE_ENUMS];

    logDebug("VM Bind", 'enum "state" OK', {
      value: stateProperty.value,
      values: enumValues,
    });

    enumValues.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.state = value;
      button.textContent = value;
      button.addEventListener("click", () => {
        stateProperty.value = value;
        setActiveButton(value);
        logDebug("State", "ViewModel enum updated", { value });
      });
      stateButtons.append(button);
    });

    setActiveButton(stateProperty.value);
  },
  onLoadError: (error): void => {
    console.error("Failed to load cute_bee.riv:", error);
  },
});

window.addEventListener("resize", () => {
  r.resizeDrawingSurfaceToCanvas();
});
