import { Vec3, WebGPUMat, toRadians } from "src/util";
import Engine from "./Engine";
import { BoundUniformBuffer } from "./buffer";
import BaseBody from "src/body/BaseBody";
import { Renderable } from "./renderPass";

const TRANSFORMATION_MATRIX_SIZE = 4 * 4;
const INITIAL_POS: Vec3 = { x: 0, y: 0, z: -25 };
const INITIAL_ROT_ANGLE = 0;
const INITIAL_ROT_AXIS: Vec3 = { x: 1, y: 0, z: 0 };

interface BeforeUpdateCallbackParams {
  readonly bodies: BaseBody[];
}

type BeforeUpdateCallback = (params: BeforeUpdateCallbackParams) => void;

export default class World {
  private static singleInstance: World | undefined = undefined;

  private engine: Engine;
  private transformMatrix: WebGPUMat.M4;
  private transformMatrixUniform: BoundUniformBuffer;

  private bodies: Set<BaseBody>;

  private constructor(engine: Engine) {
    this.engine = engine;

    this.transformMatrix = this.initTransformationMatrix(INITIAL_ROT_ANGLE, INITIAL_ROT_AXIS, INITIAL_POS);

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
   * Returns the transformation matrix.
   */
  private initTransformationMatrix(
    rotationAngle: number,
    rotationAxis: Vec3,
    translationVector: Vec3
  ): WebGPUMat.M4 {
    const canvas = this.engine.getCanvas();

    const rotation: WebGPUMat.Rotation = {
      radians: toRadians(rotationAngle),
      axis: rotationAxis,
    };
    const translation: WebGPUMat.Translation = {
      vector: translationVector,
    };

    return WebGPUMat.getTransformationMatrix({
      width: canvas.width,
      height: canvas.height,
      rotation,
      translation,
    });
  }

  /**
   * Get the transformation matrix as an array of float 32.
   */
  private getTransformationMatrix(): Float32Array {
    return new Float32Array(this.transformMatrix);
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
    WebGPUMat.rotateInplace(this.transformMatrix, {
      radians: toRadians(angle),
      axis,
    });
  }

  /**
   * Translate the position
   */
  translate(position: Vec3) {
    WebGPUMat.translateInplace(this.transformMatrix, { vector: position });
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
