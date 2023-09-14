import { webglMain } from "./webgl";
import { webgpuMain, World, Body } from "./webgpu";

function main() {
  if (!navigator.gpu) {
    webglMain();
  } else {
    webgpuMain();
  }
}

window.onload = main;

export { World, Body };
