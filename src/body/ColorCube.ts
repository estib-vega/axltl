import * as Mesh from "src/meshes";
import BaseBody from "./BaseBody";

const NAME = "ColorCube";

export class ColorCube extends BaseBody {
  constructor() {
    super(NAME, Mesh.Cube.ColorCube);
  }
}
