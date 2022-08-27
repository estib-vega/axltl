import { drawScene } from "./scene";
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

function initPositionBuffer(gl: WebGLRenderingContext, positions: number[]): WebGLBuffer | null {
    const buffer = gl.createBuffer();
    if (buffer === null) {
        return null;
    }

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return buffer;
}

function createSquarePositionBuffer(gl: WebGLRenderingContext): WebGLBuffer | null {
    const positions = [
        1.0,  1.0, 0.0,
       -1.0,  1.0, 0.0,
        1.0, -1.0, 0.0,
       -1.0, -1.0, 0.0,
    ];
    return initPositionBuffer(gl, positions);
}

function initializeGLContext() {
    const gl = getGLContext();
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    const positionBuffer = createSquarePositionBuffer(gl);
    const programInfo = setUpShaderProgram(gl);
    if (positionBuffer === null || programInfo === null) {
        return;
    }
    drawScene(gl, programInfo, positionBuffer);
}

window.onload = initializeGLContext;
