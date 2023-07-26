import { CreateCanvasParams, getCanvasElement } from "src/util/dom";
import { createRenderPipeline } from "./pipeline";
import { createBoundUniformBuffer, createCubeVertexBuffer } from "./buffer";
import {
  Rotation,
  Translation,
  getTransformationMetrixFloatArray,
  toRadians,
} from "src/util";
import { getRenderPassDescriptorFactory, renderPass } from "./renderPass";
import * as ShaderSources from "../shaderSources";

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
 * Retrieve the GPU rendering context.
 *
 * Will return `null` if either the canvas element or the WebGPU context can't be found.
 */
function getGPUContext(
  device: GPUDevice,
  params: CreateCanvasParams
): RenderContext | null {
  const canvas = getCanvasElement(params);
  const context = canvas?.getContext("webgpu");
  if (!canvas || !context) {
    return null;
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
 * Retrieve the GPU logical device.
 */
async function getGPUDevice(): Promise<GPUDevice> {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  return adapter.requestDevice();
}

export async function webgpuMain() {
  const device = await getGPUDevice();
  const renderContext = getGPUContext(device, { onVerticalScroll: () => {} });

  // Only continue if WebGL is available and working
  if (renderContext === null) {
    alert(
      "Unable to initialize WebGPU. Your browser or machine may not support it."
    );
    return;
  }

  const shaderModule = device.createShaderModule({
    code: ShaderSources.WebGPUBasic,
  });

  const renderPipeline = createRenderPipeline(
    device,
    shaderModule,
    renderContext.prefferedFormat
  );

  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniform = createBoundUniformBuffer(
    device,
    renderPipeline,
    0,
    0,
    uniformBufferSize
  );

  const getRenderPassDescriptor = getRenderPassDescriptorFactory(
    device,
    renderContext.canvas.width,
    renderContext.canvas.height
  );
  let angle = 0;

  const vertex = createCubeVertexBuffer(device);

  function frame() {
    const rotation: Rotation = {
      radians: toRadians(angle),
      axis: { x: 0.5, y: -1.0, z: 0.7 },
    };
    const translation: Translation = {
      vector: { x: 0, y: 0, z: -7 },
    };
    const transformationMatrix = getTransformationMetrixFloatArray({
      width: renderContext!.canvas.width,
      height: renderContext!.canvas.height,
      rotation,
      translation,
    });

    uniform.write(transformationMatrix);

    renderPass({
      device,
      renderPipeline,
      getRenderPassDescriptor: () =>
        getRenderPassDescriptor(renderContext!.context),
      uniformBindGroup: uniform.bindGroup,
      vertex,
    });

    angle += 2;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
