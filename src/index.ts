/*
  Load cute_bee.riv
  Artboard: Artboard
  ViewModel number: state
*/

import "./styles.css";
import { Fit, Rive, Layout } from "@rive-app/webgl2";

interface NumberProperty {
  value: number;
}

interface ViewModelInstance {
  number(name: string): NumberProperty;
}

const layout = new Layout({
  fit: Fit.Contain,
});

const riveCanvas = document.getElementById("rive-canvas") as HTMLCanvasElement;
const stateInput = document.getElementById("state-input") as HTMLInputElement;
const stateValueLabel = document.getElementById(
  "state-value",
) as HTMLSpanElement;

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

const setStateUi = (value: number): void => {
  stateInput.value = String(value);
  stateValueLabel.textContent = String(value);
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

    let stateProperty: NumberProperty | null = null;
    try {
      stateProperty = vmi.number("state");
    } catch (error) {
      console.error('Failed to bind ViewModel number "state":', error);
    }

    if (!stateProperty) {
      console.error('ViewModel number "state" not found');
      return;
    }

    logDebug("VM Bind", 'number "state" OK', { value: stateProperty.value });
    setStateUi(stateProperty.value);
    stateInput.disabled = false;

    stateInput.addEventListener("input", () => {
      const nextValue = Number(stateInput.value);
      if (Number.isNaN(nextValue)) {
        return;
      }

      stateProperty.value = nextValue;
      stateValueLabel.textContent = String(nextValue);
      logDebug("State", "ViewModel number updated", { value: nextValue });
    });
  },
  onLoadError: (error): void => {
    console.error("Failed to load cute_bee.riv:", error);
  },
});

window.addEventListener("resize", () => {
  r.resizeDrawingSurfaceToCanvas();
});
