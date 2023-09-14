import * as Mesh from "src/meshes";
import BaseBody from "./BaseBody";
import { BodyType } from "./base";

export class ColorCube extends BaseBody {
  constructor(name?: string) {
    super(name, BodyType.ColorCube, Mesh.Cube.ColorCube);
  }
}
