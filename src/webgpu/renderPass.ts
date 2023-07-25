import { Colors } from "src/util/color";
import { VertexBufferInfo } from "./buffer";

type RenderPassDescriptorFactory = (
  context: GPUCanvasContext
) => GPURenderPassDescriptor;

/**
 * Return a function that generates a render pass descriptor.
 *
 * The descriptor will the the same, expect for the color attachment's view
 * which will have to be refreshed for every frame.
 */
export function getRenderPassDescriptorFactory(
  device: GPUDevice,
  width: number,
  height: number
): RenderPassDescriptorFactory {
  const depthTexture = device.createTexture({
    size: [width, height],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
    view: depthTexture.createView(),
    depthClearValue: 1.0,
    depthLoadOp: "clear",
    depthStoreOp: "store",
  };

  return (context: GPUCanvasContext) => ({
    colorAttachments: [
      {
        clearValue: Colors.Black,
        loadOp: "clear",
        storeOp: "store",
        view: context.getCurrentTexture().createView(),
      },
    ],
    depthStencilAttachment,
  });
}

export interface RenderPassParams {
  device: GPUDevice;
  renderPipeline: GPURenderPipeline;
  getRenderPassDescriptor: () => GPURenderPassDescriptor;
  uniformBindGroup: GPUBindGroup;
  vertex: VertexBufferInfo;
}

/**
 * Execute a render pass with the given parameters.
 */
export function renderPass(params: RenderPassParams) {
  const renderPassDescriptor = params.getRenderPassDescriptor();
  const commandEncoder = params.device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  passEncoder.setPipeline(params.renderPipeline);
  passEncoder.setBindGroup(0, params.uniformBindGroup);
  passEncoder.setVertexBuffer(0, params.vertex.vertexBuffer);
  passEncoder.draw(params.vertex.vertexCount, 1, 0, 0);
  passEncoder.end();

  params.device.queue.submit([commandEncoder.finish()]);
}
