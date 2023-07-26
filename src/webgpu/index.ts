import World from "./World";

export async function webgpuMain() {
  const world = await World.instance();
  world.show();
}
