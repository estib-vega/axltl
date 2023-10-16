import { mat4 } from "gl-matrix";
import { toRadians } from "../math";
import { type Vec3, vec2Array } from "../vector";

const FOV_ANGLE = 45;

/**
 * Create a perspective matrix, a special matrix that is
 * used to simulate the distortion of perspective in a camera.
 */
export function createProjectionMatrix(width: number, height: number): mat4 {
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = toRadians(FOV_ANGLE);
  const aspect = width / height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  return projectionMatrix;
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

export function createModelViewMatrix(params: ModelViewMatrixParams): mat4 {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    vec2Array(params.translation.vector)
  ); // amount to translate

  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    params.rotation.radians,
    vec2Array(params.rotation.axis)
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
  mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

  return new Float32Array(modelViewProjectionMatrix.values());
}
