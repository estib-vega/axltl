import { mat4 } from "gl-matrix";

/**
 * Create a perspective matrix, a special matrix that is
 * used to simulate the distortion of perspective in a camera.
 */
export function createProjectionMatrix(gl: WebGLRenderingContext): mat4 {
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);

    return projectionMatrix;
}

const DEGREES_PER_SECOND = 60;
let rotation: number = 0;

export function createModelViewMatrix(deltaTime: number): mat4 {
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    [-0.0, 0.0, -8.0]);  // amount to translate


    rotation += (deltaTime * DEGREES_PER_SECOND) * Math.PI / 180; // in radians
    mat4.rotate(modelViewMatrix,
                    modelViewMatrix,
                    rotation,
                    [0.0, -1.0, 0.0]);

    return modelViewMatrix;
}