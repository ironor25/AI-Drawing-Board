/**
 * math.ts
 * Mathematical utility functions
 */

export const distance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export const angle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

export const pointInRect = (
  px: number,
  py: number,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean => {
  return px >= x && px <= x + width && py >= y && py <= y + height;
};

export const pointInCircle = (
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number,
): boolean => {
  return distance(px, py, cx, cy) <= radius;
};
