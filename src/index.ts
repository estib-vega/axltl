const CANVAS_ELEMENT_ID = "gl-canvas";

function getCanvasElement(): HTMLCanvasElement | null {
    return document.getElementById(CANVAS_ELEMENT_ID) as HTMLCanvasElement | null;
}

function getGLContext(): WebGLRenderingContext | null {
    const canvas = getCanvasElement();
    if (canvas === null) {
        return null;
    }
    return canvas.getContext("webgl");
}

function initializeGLContext() {
    const gl = getGLContext();
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  window.onload = initializeGLContext;