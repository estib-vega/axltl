import World from "./World";
import * as Body from "src/body";

export async function webgpuMain() {
  const world = await World.instance();
  let yOffset = 0;
  let zOffset = 0;
  const numOfCubes = 4 * 4 * 4;
  for (let i = 0; i < numOfCubes; i++) {
    if (i % 4 === 0) yOffset = (yOffset + 1) % 4;
    if (i % 16 === 0) zOffset++;
    const cube = new Body.ColorCube();
    const x = (i % 4) * 4 - 6;
    const z = zOffset * 4 - 10;
    const y = yOffset * 4 - 6;
    cube.position({ x, y, z });
    world.addBodies(cube);
  }
  world.show(({ bodies }) => {
    for (const body of bodies) {
      body.rotate(4, { x: 1, y: 0.5, z: -1 });
    }
    world.rotate(0.5, { x: 0.3, y: 1, z: 0.5});
  });
}
