import { Vec3, WebGPUMat, toRadians } from "src/util";
import Engine from "./Engine";
import { BoundUniformBuffer } from "./buffer";
import BaseBody from "src/body/BaseBody";
import { Renderable } from "./renderPass";

const TRANSFORMATION_MATRIX_SIZE = 4 * 4;

interface BeforeUpdateCallbackParams {
  readonly bodies: BaseBody[];
}

type BeforeUpdateCallback = (params: BeforeUpdateCallbackParams) => void;

export default class World {
  private static singleInstance: World | undefined = undefined;

  private rotationAngle: number;
  private rotationAxis: Vec3;
  private translationVector: Vec3;
  private engine: Engine;
  private transformMatrixUniform: BoundUniformBuffer;

  private bodies: Set<BaseBody>;

  private constructor(engine: Engine) {
    this.engine = engine;

    this.rotationAngle = 0;
    this.rotationAxis = { x: 0, y: -1.0, z: 0.0 };
    this.translationVector = { x: 0, y: 0, z: -20 };

    this.transformMatrixUniform = engine.createUniform(
      TRANSFORMATION_MATRIX_SIZE,
      0,
      0
    );

    this.bodies = new Set();
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
   * Add renderable bodies to the world.
   */
  public addBodies(...bodies: BaseBody[]) {
    for (const body of bodies) {
      this.bodies.add(body);
    }
  }

  /**
   * Get all renderables from the added bodies
   */
  private getRenderables(): Renderable[] {
    const result: Renderable[] = [];
    for (const body of this.bodies) {
      result.push(body.getRenderable(this.engine));
    }
    return result;
  }

  /**
   * Update the world and all the bodies inside.
   */
  private update() {
    this.updateTransformMatrixUniform();
    for (const body of this.bodies) {
      body.update();
    }
  }

  /**
   * Add to the rotation angle
   */
  rotate(angle: number, axis: Vec3) {
    this.rotationAngle += angle;
    if (this.rotationAngle > 360) {
      this.rotationAngle -= 360;
    }
    if (this.rotationAngle < 0) {
      this.rotationAngle = 360 - this.rotationAngle;
    }
    this.rotationAxis = axis;
  }

  /**
   * Start render loop.
   */
  public show(beforeUpdate: BeforeUpdateCallback) {
    const renderables = this.getRenderables();

    const frame = () => {
      beforeUpdate({ bodies: Array.from(this.bodies) });
      this.update();
      this.engine.doRenderPass(this.transformMatrixUniform, renderables);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
