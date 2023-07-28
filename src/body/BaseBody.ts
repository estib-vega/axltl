import { Vec3, WebGPUMat, toRadians } from "src/util";
import Engine from "src/webgpu/Engine";
import { Renderable } from "src/webgpu/renderPass";

const MODEL_MATRIX_SIZE = 4 * 4;

/**
 * Object body.
 *
 * Base class from which all rendered bodies should inherit.
 */
export default class BaseBody {
  private name: string;
  private mesh: number[];
  private rotationAngle: number;
  private rotationAxis: Vec3;
  private translationVector: Vec3;

  private renderable: Renderable | undefined = undefined;

  constructor(name: string, mesh: number[]) {
    this.name = name;
    this.mesh = mesh;

    this.rotationAngle = 0;
    this.rotationAxis = { x: 1, y: 0, z: 0 };
    this.translationVector = { x: 0, y: 0, z: 0 };
  }

  update() {
    if (this.renderable === undefined) {
      throw new Error(
        `Unable to update ${this.name} because the renderable has not yet been initialiezed. Please call 'getRenderable'`
      );
    }

    const translation: WebGPUMat.Translation = {
      vector: this.translationVector,
    };
    const rotation: WebGPUMat.Rotation = {
      radians: toRadians(this.rotationAngle),
      axis: this.rotationAxis,
    };
    const modelMatrix = WebGPUMat.createModelViewMatrix({
      translation,
      rotation,
    });

    const modelValues = new Float32Array(modelMatrix.values());
    this.renderable.modelUniform.write(modelValues);
  }

  rotate(angle: number, axis: Vec3) {
    this.rotationAngle += angle;
    this.rotationAxis = axis;
  }

  position(position: Vec3) {
    this.translationVector = position;
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
