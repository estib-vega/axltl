import { mat4 } from "gl-matrix";
import * as Util from "./util";

const FOV_ANGLE = 45;

/**
 * Create a perspective matrix, a special matrix that is
 * used to simulate the distortion of perspective in a camera.
 */
export function createProjectionMatrix(gl: WebGLRenderingContext): mat4 {
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = Util.toRadians(FOV_ANGLE);
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

// ######################################################################
// ######################################################################
// MODEL VIEW MATRIX

export interface Rotation {
    radians: number;
    axis: Util.Vec3;
}

export interface Translation {
    vector: Util.Vec3;
}

export interface ModelViewMatrixParams {
    translation: Translation;
    rotation: Rotation;
}

export function createModelViewMatrix(params: ModelViewMatrixParams): mat4 {
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    Util.vec2Array(params.translation.vector));  // amount to translate

    mat4.rotate(modelViewMatrix,
                    modelViewMatrix,
                    params.rotation.radians,
                    Util.vec2Array(params.rotation.axis));

    return modelViewMatrix;
}