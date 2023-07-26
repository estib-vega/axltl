import {
  CreateCanvasParams,
  Rotation,
  Translation,
  getCanvasElement,
  getTransformationMetrixFloatArray,
} from "src/util";
import * as ShaderSources from "src/shaderSources";
import { createRenderPipeline } from "./pipeline";
import {
  RenderPassDescriptorFactory,
  getRenderPassDescriptorFactory,
} from "./renderPass";
import {
  BoundUniformBuffer,
  VertexBufferInfo,
  createBoundUniformBuffer,
} from "./buffer";

const FLOAT_32_BYTE_LEN = 4;

interface RenderContext {
  /**
   * Canvas element to render to.
   */
  canvas: HTMLCanvasElement;
  /**
   * Configured rendering context.
   */
  context: GPUCanvasContext;
  /**
   * The devices preferred texture format.
   */
  prefferedFormat: GPUTextureFormat;
}

/**
 * Retrieve the GPU logical device.
 */
async function getGPUDevice(): Promise<GPUDevice> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  return adapter.requestDevice();
}

/**
 * Retrieve the GPU rendering context.
 *
 * Will return `null` if either the canvas element or the WebGPU context can't be found.
 */
function getGPUContext(
  device: GPUDevice,
  params: CreateCanvasParams
): RenderContext {
  const canvas = getCanvasElement(params);
  const context = canvas?.getContext("webgpu");
  if (!canvas) {
    throw Error("Unable to to find canvas element by id.");
  }

  if (!context) {
    throw Error(
      "Unable to initialize WebGPU. Your browser or machine may not support it."
    );
  }

  const prefferedFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device: device,
    format: prefferedFormat,
    alphaMode: "premultiplied",
  });

  return { context, canvas, prefferedFormat };
}

/**
 * Render engine instance
 */
export default class Engine {
  private static singleInstance: Engine | undefined = undefined;
  private device: GPUDevice;
  private canvas: HTMLCanvasElement;
  private context: GPUCanvasContext;
  private prefferedFormat: GPUTextureFormat;
  private pipeline: GPURenderPipeline;
  private getRenderPassDescriptor: RenderPassDescriptorFactory;

  private constructor(device: GPUDevice) {
    this.device = device;
    const renderContext = getGPUContext(device, { onVerticalScroll: () => {} });
    this.canvas = renderContext.canvas;
    this.context = renderContext.context;
    this.prefferedFormat = renderContext.prefferedFormat;

    const shaderModule = device.createShaderModule({
      code: ShaderSources.WebGPUBasic,
    });

    this.pipeline = createRenderPipeline(
      device,
      shaderModule,
      this.prefferedFormat
    );

    this.getRenderPassDescriptor = getRenderPassDescriptorFactory(
      device,
      this.canvas.width,
      this.canvas.height
    );
  }

  /**
   * Get the single instance of the engine.
   */
  static async instance(): Promise<Engine> {
    if (this.singleInstance === undefined) {
      const device = await getGPUDevice();
      this.singleInstance = new Engine(device);
    }
    return this.singleInstance;
  }

  /**
   * Create a writable uniform buffer, with an indexed binding and group.
   */
  public createUniform(
    size: number,
    groupIndex: number,
    bindingIndex: number
  ): BoundUniformBuffer {
    return createBoundUniformBuffer(
      this.device,
      this.pipeline,
      groupIndex,
      bindingIndex,
      size * FLOAT_32_BYTE_LEN
    );
  }

  /**
   * Create vertex buffer info for the given data
   */
  public createVertexBufferInfo(information: number[]): VertexBufferInfo {
    const vertices = new Float32Array(information);

    //  We give it a size equal to the length of the vertices array so it can contain all the data,
    // and `VERTEX` and `COPY_DST` usage flags to indicate that the buffer will be used as a vertex
    // buffer and the destination of copy operations.
    const vertexBuffer = this.device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    // `writeBuffer` takes as its parameters the buffer to write to, the data source to write from,
    // an offset value for each, and the size of data to write (we've specified the whole length of
    // the array). The browser then works out the most efficient way to handle writing the data.
    this.device.queue.writeBuffer(
      vertexBuffer,
      0,
      vertices.buffer,
      vertices.byteOffset,
      vertices.byteLength
    );

    return { vertexBuffer, vertexCount: information.length / 8 };
  }

  public getTransformationMatrix(
    rotation: Rotation,
    translation: Translation
  ): Float32Array {
    return getTransformationMetrixFloatArray({
      width: this.canvas.width,
      height: this.canvas.height,
      rotation,
      translation,
    });
  }

  /**
   * Execute a render pass with the given uniform and vertex information
   */
  public doRenderPass(
    uniform: BoundUniformBuffer,
    vertexInfo: VertexBufferInfo
  ) {
    const commandEncoder = this.device.createCommandEncoder();
    const renderPassDescriptor = this.getRenderPassDescriptor(this.context);
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, uniform.bindGroup);
    passEncoder.setVertexBuffer(0, vertexInfo.vertexBuffer);
    passEncoder.draw(vertexInfo.vertexCount, 1, 0, 0);
    passEncoder.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }
}
