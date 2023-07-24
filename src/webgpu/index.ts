import { CreateCanvasParams, getCanvasElement } from "src/util/dom";
import { createPipeline as createRenderPipeline } from "./pipeline";
import { createCubeVertexBuffer } from "./buffer";
import { mat4, vec3 } from "gl-matrix";
import {
  Rotation,
  Translation,
  createModelViewMatrix,
  createProjectionMatrix,
  toRadians,
} from "src/util";

const shaders = `
struct Uniforms {
  modelViewProjectionMatrix : mat4x4<f32>,
}

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOut {
  @builtin(position) position : vec4<f32>,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position : vec4<f32>,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position =  uniforms.modelViewProjectionMatrix * position;
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}
`;

interface RenderContext {
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
}

function getGPUContext(params: CreateCanvasParams): RenderContext | null {
  const canvas = getCanvasElement(params);
  const context = canvas?.getContext("webgpu");
  if (!canvas || !context) {
    return null;
  }
  return { context, canvas };
}

export async function webgpuMain() {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  const device = await adapter.requestDevice();

  const shaderModule = device.createShaderModule({
    code: shaders,
  });

  const renderContext = getGPUContext({ onVerticalScroll: () => {} });

  // Only continue if WebGL is available and working
  if (renderContext === null) {
    alert(
      "Unable to initialize WebGPU. Your browser or machine may not support it."
    );
    return;
  }

  const devicePixelRatio = window.devicePixelRatio ?? 1;
  renderContext.canvas.width =
    renderContext.canvas.clientWidth * devicePixelRatio;
  renderContext.canvas.height =
    renderContext.canvas.clientHeight * devicePixelRatio;

  const prefferedFormat = navigator.gpu.getPreferredCanvasFormat();

  renderContext.context.configure({
    device: device,
    format: prefferedFormat,
    alphaMode: "premultiplied",
  });

  const renderPipeline = createRenderPipeline(
    device,
    shaderModule,
    prefferedFormat
  );

  const clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };

  const depthTexture = device.createTexture({
    size: [renderContext.canvas.width, renderContext.canvas.height],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformBindGroup = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: clearColor,
        loadOp: "clear",
        storeOp: "store",
        view: renderContext.context.getCurrentTexture().createView(),
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),

      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
    },
  };

  const projectionMatrix = createProjectionMatrix(
    renderContext.canvas.width,
    renderContext.canvas.height
  );

  let angle = 0;

  const getTransformationMetrix = (): Float32Array => {
    const rotation: Rotation = {
      radians: toRadians(angle),
      axis: { x: 0.5, y: -1.0, z: 0 },
    };
    const translation: Translation = {
      vector: { x: 0, y: 0, z: -7 },
    };
    const modelViewMatrix = createModelViewMatrix({ rotation, translation });

    const modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);

    angle += 2;
    return new Float32Array(
      modelViewProjectionMatrix.values()
    );
  };

  const { vertexBuffer, vertexCount } = createCubeVertexBuffer(device);

  function frame() {
    const transformationMatrix = getTransformationMetrix();
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      transformationMatrix,
      0,
      transformationMatrix.length
    );
    (renderPassDescriptor.colorAttachments as any)[0].view =
      renderContext!.context.getCurrentTexture().createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(renderPipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(vertexCount, 1, 0, 0);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
