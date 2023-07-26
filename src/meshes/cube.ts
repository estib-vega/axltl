/**
 * Simple cube with color information
 */
export const ColorCube = [
  // Positions ------------ Colors
  // Front face           White
  1, -1, 1, 1,            1.0, 1.0, 1.0, 1.0,
  -1, -1, 1, 1,           1.0, 1.0, 1.0, 1.0,
  -1, -1, -1, 1,          1.0, 1.0, 1.0, 1.0,
  1, -1, -1, 1,           1.0, 1.0, 1.0, 1.0,
  1, -1, 1, 1,            1.0, 1.0, 1.0, 1.0,
  -1, -1, -1, 1,          1.0, 1.0, 1.0, 1.0,

  // Back face            Red
  1, 1, 1, 1,             1.0, 0.0, 0.0, 1.0,
  1, -1, 1, 1,            1.0, 0.0, 0.0, 1.0,
  1, -1, -1, 1,           1.0, 0.0, 0.0, 1.0,
  1, 1, -1, 1,            1.0, 0.0, 0.0, 1.0,
  1, 1, 1, 1,             1.0, 0.0, 0.0, 1.0,
  1, -1, -1, 1,           1.0, 0.0, 0.0, 1.0,

  // Top face             Green
  -1, 1, 1, 1,            0.0, 1.0, 0.0, 1.0,
  1, 1, 1, 1,             0.0, 1.0, 0.0, 1.0,
  1, 1, -1, 1,            0.0, 1.0, 0.0, 1.0,
  -1, 1, -1, 1,           0.0, 1.0, 0.0, 1.0,
  -1, 1, 1, 1,            0.0, 1.0, 0.0, 1.0,
  1, 1, -1, 1,            0.0, 1.0, 0.0, 1.0,

  // Bottom face          Blue
  -1, -1, 1, 1,           0.0, 0.0, 1.0, 1.0,
  -1, 1, 1, 1,            0.0, 0.0, 1.0, 1.0,
  -1, 1, -1, 1,           0.0, 0.0, 1.0, 1.0,
  -1, -1, -1, 1,          0.0, 0.0, 1.0, 1.0,
  -1, -1, 1, 1,           0.0, 0.0, 1.0, 1.0,
  -1, 1, -1, 1,           0.0, 0.0, 1.0, 1.0,

  // Right face           Yellow
  1, 1, 1, 1,             1.0, 1.0, 0.0, 1.0,
  -1, 1, 1, 1,            1.0, 1.0, 0.0, 1.0,
  -1, -1, 1, 1,           1.0, 1.0, 0.0, 1.0,
  -1, -1, 1, 1,           1.0, 1.0, 0.0, 1.0,
  1, -1, 1, 1,            1.0, 1.0, 0.0, 1.0,
  1, 1, 1, 1,             1.0, 1.0, 0.0, 1.0,

  // Left face            Purple
  1, -1, -1, 1,           1.0, 0.0, 1.0, 1.0,
  -1, -1, -1, 1,          1.0, 0.0, 1.0, 1.0,
  -1, 1, -1, 1,           1.0, 0.0, 1.0, 1.0,
  1, 1, -1, 1,            1.0, 0.0, 1.0, 1.0,
  1, -1, -1, 1,           1.0, 0.0, 1.0, 1.0,
  -1, 1, -1, 1,           1.0, 0.0, 1.0, 1.0,
];
