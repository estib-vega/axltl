const CANVAS_ELEMENT_ID = "gl-canvas";
const CANVAS_WIDTH_PX = 640;
const CANVAS_HEIGHT_PX = 640;

export interface CreateCanvasParams {
  onVerticalScroll: (delta: number) => void;
}

export function getCanvasElement(
  params: CreateCanvasParams
): HTMLCanvasElement | null {
  const canvas = document.getElementById(
    CANVAS_ELEMENT_ID
  ) as HTMLCanvasElement | null;
  if (canvas === null) {
    return null;
  }
  const desiredCSSWidth = CANVAS_WIDTH_PX;
  const desiredCSSHeight = CANVAS_HEIGHT_PX;
  const devicePixelRatio = window.devicePixelRatio || 1;

  canvas.width = desiredCSSWidth * devicePixelRatio;
  canvas.height = desiredCSSHeight * devicePixelRatio;

  canvas.style.width = desiredCSSWidth + "px";
  canvas.style.height = desiredCSSHeight + "px";

  canvas.addEventListener("wheel", (event) => {
    params.onVerticalScroll(event.deltaY);
    event.stopPropagation();
  });

  return canvas;
}
