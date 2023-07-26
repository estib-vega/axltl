import Engine from "./Engine";

export interface VertexBufferInfo {
  /**
   * GPU buffer containing the vertex information
   */
  vertexBuffer: GPUBuffer;
  /**
   * Number of vertices contained
   */
  vertexCount: number;
}

export interface BoundUniformBuffer {
  write: (values: Float32Array) => void;
  bindGroup: GPUBindGroup;
}

export function createBoundUniformBuffer(
  device: GPUDevice,
  renderPipeline: GPURenderPipeline,
  bindGroupIndex: number,
  bindingIndex: number,
  bufferSize: number
): BoundUniformBuffer {
  const uniformBuffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(bindGroupIndex),
    entries: [
      {
        binding: bindingIndex,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const write = (values: Float32Array) =>
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      values.buffer,
      values.byteOffset,
      values.byteLength
    );

  return {
    write,
    bindGroup,
  };
}
