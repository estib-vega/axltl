import { createCubePrimitiveBuffers } from "./buffer";
import SceneManager from "./scene";
import { setUpShaderProgram } from "./shader";

const CANVAS_ELEMENT_ID = "gl-canvas";
const CANVAS_WIDTH_PX = 640;
const CANVAS_HEIGHT_PX = 640;

function getCanvasElement(): HTMLCanvasElement | null {
    const canvas = document.getElementById(CANVAS_ELEMENT_ID) as HTMLCanvasElement | null;
    if (canvas === null) {
        return null;
    }
    const desiredCSSWidth = CANVAS_WIDTH_PX;
    const desiredCSSHeight = CANVAS_HEIGHT_PX;
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width  = desiredCSSWidth  * devicePixelRatio;
    canvas.height = desiredCSSHeight * devicePixelRatio;

    canvas.style.width  = desiredCSSWidth  + "px";
    canvas.style.height = desiredCSSHeight + "px";

    return canvas;
}

function getGLContext(): WebGLRenderingContext | null {
    const canvas = getCanvasElement();
    if (canvas === null) {
        return null;
    }
    return canvas.getContext("webgl");
}

function renderLoop(
    drawFrame: (deltaTime: number) => void
) {
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

function main() {
    const scene = SceneManager.instance();
    const gl = getGLContext();

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const primitiveBuffers = createCubePrimitiveBuffers(gl);
    const programInfo = setUpShaderProgram(gl);
    if (primitiveBuffers === null || programInfo === null) {
        return;
    }

    scene.init(gl);
    renderLoop((deltaTime) => scene.drawScene(deltaTime, programInfo, primitiveBuffers));
}

window.onload = main;
