import { type Vec3, WebGPUMat, toRadians } from "src/util";

export const MODEL_MATRIX_SIZE = 4 * 4;
export const INITIAL_POS: Vec3 = { x: 0, y: 0, z: 0 };
export const INITIAL_ROT_ANGLE = 0;
export const INITIAL_ROT_AXIS: Vec3 = { x: 1, y: 0, z: 0 };

/**
 * Know body types.
 */
export enum BodyType {
  ColorCube = "ColorCube",
}


/**
 * Returns the model view matrix.
 */
export function initializeModelMatrix(): WebGPUMat.M4 {
  const translation: WebGPUMat.Translation = {
    vector: INITIAL_POS,
  };
  const rotation: WebGPUMat.Rotation = {
    radians: toRadians(INITIAL_ROT_ANGLE),
    axis: INITIAL_ROT_AXIS,
  };
  return WebGPUMat.createModelViewMatrix({
    translation,
    rotation,
  });
}