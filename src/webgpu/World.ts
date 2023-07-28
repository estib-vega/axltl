import { Vec3, WebGPUMat, WebGLMat, toRadians } from "src/util";
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
    this.rotationAxis = { x: 0, y: -1.0, z: 0.0 };
    this.translationVector = { x: 0, y: 0, z: -17 };

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
      vector: this.translationVector,
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
    const cube1 = new Body.ColorCube();
    cube1.position({ x: -2, y: 0, z: 0 });
    const cube2 = new Body.ColorCube();
    cube2.position({ x: 2, y: 0, z: 0 });
    const renderable1 = cube1.getRenderable(this.engine);
    const renderabl2 = cube2.getRenderable(this.engine);

    const cubes = [cube1, cube2];
    const renderables = [renderable1, renderabl2];

    const rotationVelocity = 1;

    const frame = () => {
      this.updateTransformMatrixUniform();
      cube1.rotate(rotationVelocity, { x: 1, y: 0, z: 0 });
      cube2.rotate(rotationVelocity, { x: 0, y: 0, z: 1 });
      for (const cube of cubes) {
        cube.update();
      }
      this.engine.doRenderPass(this.transformMatrixUniform, renderables);
      this.rotationAngle += 0.5;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
