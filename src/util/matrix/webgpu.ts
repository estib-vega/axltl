import { toRadians } from "../math";
import { Vec3, vec2Array } from "../vector";
import { Mat4, mat4 } from "wgpu-matrix";

const FOV_ANGLE = 45;

export type M4 = Mat4;

/**
 * Create an identity matrix
 */
export function createMatrix4(): M4 {
  return mat4.identity();
}

/**
 * Create a perspective matrix, a special matrix that is
 * used to simulate the distortion of perspective in a camera.
 */
export function createProjectionMatrix(
  width: number,
  height: number
): M4 {
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
  target?: M4;
  translation: Translation;
  rotation: Rotation;
}

export function rotateInplace(matrix: M4, params: Rotation) {
  mat4.rotate(
    matrix,
    vec2Array(params.axis),
    params.radians,
    matrix,
  );
}

export function translateInplace(matrix: M4, params: Translation) {
  mat4.translate(
    matrix, // matrix to translate
    vec2Array(params.vector),
    matrix // destination matrix
  ); // amount to translate
}

export function createModelViewMatrix(params: ModelViewMatrixParams): M4 {
  const modelViewMatrix = params.target ?? createMatrix4();

  translateInplace(modelViewMatrix, params.translation);
  rotateInplace(modelViewMatrix, params.rotation);

  return modelViewMatrix;
}

// ######################################################################
// ######################################################################
// TRANSFORMATION MATRIX

interface TransformationMatrixParams {
  target?: M4;
  width: number;
  height: number;
  rotation: Rotation;
  translation: Translation;
}

/**
 * Create the transformation matrix for the given parameters..
 */
export function getTransformationMatrix(
  params: TransformationMatrixParams
): M4 {
  const { width, height, rotation, translation, target } = params;
  const projectionMatrix = createProjectionMatrix(width, height);
  const modelViewMatrix = createModelViewMatrix({ rotation, translation, target });

  const modelViewProjectionMatrix = mat4.create();
  mat4.multiply(projectionMatrix, modelViewMatrix, modelViewProjectionMatrix);

  return modelViewProjectionMatrix;
}
/**
 * Create the transformation matrix for the given parameters.
 *
 * @returns {Float32Array} Will return the matrix information as a `Float32Array`.
 */
export function getTransformationMatrixFloatArray(
  params: TransformationMatrixParams
): Float32Array {
  return new Float32Array(getTransformationMatrix(params).values());
}
