import { Vec3, WebGPUMat, toRadians } from "src/util";
import Engine from "src/webgpu/Engine";
import { Renderable } from "src/webgpu/renderPass";
import { BodyId, createBodyId } from "./id";
import { BodyType, MODEL_MATRIX_SIZE, initializeModelMatrix } from "./base";


/**
 * Object body.
 *
 * Base class from which all rendered bodies should inherit.
 */
export default class BaseBody {
  private name: string;
  private id: BodyId<BodyType>;
  private mesh: number[];
  private modelMatrix: WebGPUMat.M4;
  private renderable: Renderable | undefined = undefined;

  constructor(name: string | undefined, type: BodyType, mesh: number[]) {
    this.name = name ?? type;
    this.id = createBodyId("", type);
    this.mesh = mesh;

    this.modelMatrix = initializeModelMatrix();
  }

  getId(): BodyId<BodyType> {
    return this.id;
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
