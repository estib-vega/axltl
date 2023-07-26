import * as Mesh from "src/meshes";
import BaseBody from "./BaseBody";

export class ColorCube extends BaseBody {
  constructor() {
    super(Mesh.Cube.ColorCube);
  }
}
