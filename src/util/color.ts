export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ColorMap {
  [colorName: string]: RGBA;
}

export const Colors = {
  Black: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
} satisfies ColorMap;
