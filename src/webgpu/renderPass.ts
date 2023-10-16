import { Colors } from "src/util/color";
import type { BoundUniformBuffer, VertexBufferInfo } from "./buffer";

export interface Renderable {
  modelUniform: BoundUniformBuffer,
  vertexInfo: VertexBufferInfo;
}

export type RenderPassDescriptorFactory = (
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
