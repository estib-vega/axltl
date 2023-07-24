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

/**
 * Initialize a vertex buffer with the given information.
 *
 * @param device GPU device
 * @param information Array of numeric values representing position or color information
 * @returns
 */
function initVertexBuffer(
  device: GPUDevice,
  information: number[]
): GPUBuffer {
  const vertices = new Float32Array(information);

  //  We give it a size equal to the length of the vertices array so it can contain all the data,
  // and `VERTEX` and `COPY_DST` usage flags to indicate that the buffer will be used as a vertex
  // buffer and the destination of copy operations.
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  // `writeBuffer` takes as its parameters the buffer to write to, the data source to write from,
  // an offset value for each, and the size of data to write (we've specified the whole length of
  // the array). The browser then works out the most efficient way to handle writing the data.
  device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);

  return vertexBuffer;
}

export function createCubeVertexBuffer(device: GPUDevice): VertexBufferInfo {

  const information = [
    // Positions ------------ Colors
    // Front face           White
    1, -1, 1, 1,   1.0, 1.0, 1.0, 1.0,
    -1, -1, 1, 1,  1.0, 1.0, 1.0, 1.0,
    -1, -1, -1, 1, 1.0, 1.0, 1.0, 1.0,
    1, -1, -1, 1,  1.0, 1.0, 1.0, 1.0,
    1, -1, 1, 1,   1.0, 1.0, 1.0, 1.0,
    -1, -1, -1, 1, 1.0, 1.0, 1.0, 1.0,

    // Back face            Red
    1, 1, 1, 1,    1.0, 0.0, 0.0, 1.0,
    1, -1, 1, 1,   1.0, 0.0, 0.0, 1.0,
    1, -1, -1, 1,  1.0, 0.0, 0.0, 1.0,
    1, 1, -1, 1,   1.0, 0.0, 0.0, 1.0,
    1, 1, 1, 1,    1.0, 0.0, 0.0, 1.0,
    1, -1, -1, 1,  1.0, 0.0, 0.0, 1.0,

    // Top face             Green
    -1, 1, 1, 1,     0.0, 1.0, 0.0, 1.0,
    1, 1, 1, 1,      0.0, 1.0, 0.0, 1.0,
    1, 1, -1, 1,     0.0, 1.0, 0.0, 1.0,
    -1, 1, -1, 1,    0.0, 1.0, 0.0, 1.0,
    -1, 1, 1, 1,     0.0, 1.0, 0.0, 1.0,
    1, 1, -1, 1,     0.0, 1.0, 0.0, 1.0,

    // Bottom face          Blue
    -1, -1, 1, 1,  0.0, 0.0, 1.0, 1.0,
    -1, 1, 1, 1,   0.0, 0.0, 1.0, 1.0,
    -1, 1, -1, 1,  0.0, 0.0, 1.0, 1.0,
    -1, -1, -1, 1, 0.0, 0.0, 1.0, 1.0,
    -1, -1, 1, 1,  0.0, 0.0, 1.0, 1.0,
    -1, 1, -1, 1,  0.0, 0.0, 1.0, 1.0,

    // Right face           Yellow
    1, 1, 1, 1,    1.0, 1.0, 0.0, 1.0,
    -1, 1, 1, 1,   1.0, 1.0, 0.0, 1.0,
    -1, -1, 1, 1,  1.0, 1.0, 0.0, 1.0,
    -1, -1, 1, 1,  1.0, 1.0, 0.0, 1.0,
    1, -1, 1, 1,   1.0, 1.0, 0.0, 1.0,
    1, 1, 1, 1,    1.0, 1.0, 0.0, 1.0,

    // Left face            Purple
    1, -1, -1, 1,  1.0, 0.0, 1.0, 1.0,
    -1, -1, -1, 1, 1.0, 0.0, 1.0, 1.0,
    -1, 1, -1, 1,  1.0, 0.0, 1.0, 1.0,
    1, 1, -1, 1,   1.0, 0.0, 1.0, 1.0,
    1, -1, -1, 1,  1.0, 0.0, 1.0, 1.0,
    -1, 1, -1, 1,  1.0, 0.0, 1.0, 1.0,
  ];
  const vertexBuffer = initVertexBuffer(device, information);
  return { vertexBuffer, vertexCount: information.length / 8 };
}
