import { createCubeVertexBuffer } from "./buffer";
import { Rotation, Translation, toRadians } from "src/util";
import Engine from "./Engine";

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
  const engine = new Engine(device);

  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniform = engine.createUniform(uniformBufferSize, 0, 0);

  let angle = 0;

  const vertex = createCubeVertexBuffer(engine);

  function frame() {
    const rotation: Rotation = {
      radians: toRadians(angle),
      axis: { x: 0.5, y: -1.0, z: 0.7 },
    };
    const translation: Translation = {
      vector: { x: 0, y: 0, z: -7 },
    };
    const transformationMatrix = engine.getTransformationMatrix(
      rotation,
      translation
    );
    uniform.write(transformationMatrix);

    engine.doRenderPass(uniform, vertex);

    angle += 2;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
