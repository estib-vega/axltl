import { Vec3, WebGPUMat, toRadians } from "src/util";
import Engine from "src/webgpu/Engine";
import { Renderable } from "src/webgpu/renderPass";

const MODEL_MATRIX_SIZE = 4 * 4;
const INITIAL_POS: Vec3 = { x: 0, y: 0, z: 0 };
const INITIAL_ROT_ANGLE = 0;
const INITIAL_ROT_AXIS: Vec3 = { x: 1, y: 0, z: 0 };

/**
 * Returns the model view matrix.
 */
function initializeModelMatrix(): WebGPUMat.M4 {
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

/**
 * Object body.
 *
 * Base class from which all rendered bodies should inherit.
 */
export default class BaseBody {
  private name: string;
  private mesh: number[];
  private modelMatrix: WebGPUMat.M4;
  private renderable: Renderable | undefined = undefined;

  constructor(name: string, mesh: number[]) {
    this.name = name;
    this.mesh = mesh;

    this.modelMatrix = initializeModelMatrix();
  }

  update() {
    if (this.renderable === undefined) {
      throw new Error(
        `Unable to update ${this.name} because the renderable has not yet been initialiezed. Please call 'getRenderable'`
      );
    }

    const modelValues = new Float32Array(this.modelMatrix.values());
    this.renderable.modelUniform.write(modelValues);
  }

  rotate(angle: number, axis: Vec3) {
    WebGPUMat.rotateInplace(this.modelMatrix, {
      radians: toRadians(angle),
      axis,
    });
  }

  translate(position: Vec3) {
    WebGPUMat.translateInplace(this.modelMatrix, { vector: position });
  }

  getRenderable(engine: Engine): Renderable {
    if (this.renderable === undefined) {
      const vertexInfo = engine.createVertexBufferInfo(this.mesh);
      const modelUniform = engine.createUniform(MODEL_MATRIX_SIZE, 1, 0);
      this.renderable = {
        vertexInfo,
        modelUniform,
      };
    }
    return this.renderable;
  }
}
