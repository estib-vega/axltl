/**
 * Turn degrees into radians
 */
export function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

/**
 * Limit a numeric value within the given limits
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
}