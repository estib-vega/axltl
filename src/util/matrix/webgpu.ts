import { toRadians } from "../math";
import { Vec3, vec2Array } from "../vector";
import { Mat4, mat4 } from "wgpu-matrix";

const FOV_ANGLE = 45;

/**
 * Create a perspective matrix, a special matrix that is
 * used to simulate the distortion of perspective in a camera.
 */
export function createProjectionMatrix(
  width: number,
  height: number
): Mat4 {
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = toRadians(FOV_ANGLE);
  const aspect = width / height;
  const zNear = 0.1;
  const zFar = 100.0;

  return mat4.perspective(
    fieldOfView,
    aspect,
    zNear,
    zFar
  );
}

// ######################################################################
// ######################################################################
// MODEL VIEW MATRIX

export interface Rotation {
  radians: number;
  axis: Vec3;
}

export interface Translation {
  vector: Vec3;
}

export interface ModelViewMatrixParams {
  translation: Translation;
  rotation: Rotation;
}

export function createModelViewMatrix(params: ModelViewMatrixParams): Mat4 {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.identity();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // matrix to translate
    vec2Array(params.translation.vector),
    modelViewMatrix // destination matrix
  ); // amount to translate

  mat4.rotate(
    modelViewMatrix,
    vec2Array(params.rotation.axis),
    params.rotation.radians,
    modelViewMatrix,
  );

  return modelViewMatrix;
}

// ######################################################################
// ######################################################################
// TRANSFORMATION MATRIX

interface TransformationMatrixParams {
  width: number;
  height: number;
  rotation: Rotation;
  translation: Translation;
}

/**
 * Create the transformation matrix for the given parameters.
 *
 * @returns {Float32Array} Will return the matrix information as a `Float32Array`.
 */
export function getTransformationMetrixFloatArray(
  params: TransformationMatrixParams
): Float32Array {
  const { width, height, rotation, translation } = params;
  const projectionMatrix = createProjectionMatrix(width, height);
  const modelViewMatrix = createModelViewMatrix({ rotation, translation });

  const modelViewProjectionMatrix = mat4.create();
  mat4.multiply(projectionMatrix, modelViewMatrix, modelViewProjectionMatrix);

  return new Float32Array(modelViewProjectionMatrix.values());
}
