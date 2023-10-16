import { type CreateCanvasParams, getCanvasElement } from "src/util/dom";
import { createCubePrimitiveBuffers } from "./buffer";
import SceneManager from "./scene";
import { setUpShaderProgram } from "./shader";

function getGLContext(
  params: CreateCanvasParams
): WebGLRenderingContext | null {
  const canvas = getCanvasElement(params);
  if (canvas === null) {
    return null;
  }
  return canvas.getContext("webgl");
}

function renderLoop(drawFrame: (deltaTime: number) => void) {
  let then: number = 0;
  const render = (nowInMS: number) => {
    const now = nowInMS / 1000; // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawFrame(deltaTime);
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

export function webglMain() {
  const scene = SceneManager.instance();
  const gl = getGLContext({
    onVerticalScroll: (d) => scene.zoom(d),
  });

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const primitiveBuffers = createCubePrimitiveBuffers(gl);
  const programInfo = setUpShaderProgram(gl);
  if (primitiveBuffers === null || programInfo === null) {
    return;
  }

  scene.init(gl);
  renderLoop((deltaTime) =>
    scene.drawScene(deltaTime, programInfo, primitiveBuffers)
  );
}
