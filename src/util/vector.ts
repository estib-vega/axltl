
export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface Vec4 extends Vec3 {
    w: number;
}

export type Vector = Vec3 | Vec4;

/**
 * Create a number array from a vector in order
 */
export function vec2Array(vector: Vec3): [number, number, number];
export function vec2Array(vector: Vec4): [number, number, number, number];
export function vec2Array(vector: Vector): number[] {
    const result = [vector.x, vector.y, vector.z];
    if ((vector as any).w !== undefined) {
        result.push((vector as any).w);
    }
    return result;
}