import { webglMain } from "./webgl";
import { webgpuMain } from "./webgpu";

function main() {
  if (!navigator.gpu) {
    webglMain();
  } else {
    webgpuMain();
  }
}

window.onload = main;
