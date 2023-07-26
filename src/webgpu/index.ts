import { Rotation, Translation, toRadians } from "src/util";
import Engine from "./Engine";
import * as Body from "src/body";

export async function webgpuMain() {
  const engine = await Engine.instance();

  const uniformSize = 16; // 4x4 matrix
  const uniform = engine.createUniform(uniformSize, 0, 0);

  let angle = 0;

  const cube = new Body.ColorCube();
  const vertex = cube.getVertexInfo(engine);

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
