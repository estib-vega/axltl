import Engine from "src/webgpu/Engine";
import { VertexBufferInfo } from "src/webgpu/buffer";

/**
 * Object body.
 *
 * Base class from which all rendered bodies should inherit.
 */
export default class BaseBody {
  private mesh: number[];

  constructor(mesh: number[]) {
    this.mesh = mesh;
  }

  getVertexInfo(engine: Engine): VertexBufferInfo {
    return engine.createVertexBufferInfo(this.mesh);
  }
}
