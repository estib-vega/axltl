import {
  Vec3,
  WebGPUMat,
  WebGLMat,
  toRadians,
} from "src/util";
import Engine from "./Engine";
import { BoundUniformBuffer } from "./buffer";
import * as Body from "src/body";

const TRANSFORMATION_MATRIX_SIZE = 4 * 4;

export default class World {
  private static singleInstance: World | undefined = undefined;

  private rotationAngle: number;
  private rotationAxis: Vec3;
  private translationVector: Vec3;
  private engine: Engine;
  private transformMatrixUniform: BoundUniformBuffer;

  private constructor(engine: Engine) {
    this.engine = engine;

    this.rotationAngle = 0;
    this.rotationAxis = { x: 0, y: -1.0, z: 0.7 };
    this.translationVector = { x: 0, y: 0, z: -7 };

    this.transformMatrixUniform = engine.createUniform(
      TRANSFORMATION_MATRIX_SIZE,
      0,
      0
    );
  }

  /**
   * Get the single instance of the world.
   */
  static async instance(): Promise<World> {
    if (this.singleInstance === undefined) {
      const engine = await Engine.instance();
      this.singleInstance = new World(engine);
    }
    return this.singleInstance;
  }

  /**
   * Get the transformation matrix given the current rotation and translation.
   */
  private getTransformationMatrix(): Float32Array {
    const canvas = this.engine.getCanvas();

    const rotation: WebGPUMat.Rotation = {
      radians: toRadians(this.rotationAngle),
      axis: this.rotationAxis,
    };
    const translation: WebGPUMat.Translation = {
      vector:  this.translationVector,
    };

    return WebGPUMat.getTransformationMetrixFloatArray({
      width: canvas.width,
      height: canvas.height,
      rotation,
      translation,
    });
  }

  /**
   * Write the current world position values to the uniform.
   */
  private updateTransformMatrixUniform() {
    const transformationMatrix = this.getTransformationMatrix();
    this.transformMatrixUniform.write(transformationMatrix);
  }

  /**
   * Start render loop.
   */
  public show() {
    const cube = new Body.ColorCube();
    const vertex = cube.getVertexInfo(this.engine);

    const frame = () => {
      this.updateTransformMatrixUniform();
      this.engine.doRenderPass(this.transformMatrixUniform, vertex);
      this.rotationAngle += 3;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
