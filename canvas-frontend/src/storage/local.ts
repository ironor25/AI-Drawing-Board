// canvas/storage.ts
import type { ShapePayload } from "../types/shape";

const STORAGE_KEY = "canvas:shapes";

export function loadShapes(): ShapePayload[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveShapes(shapes: ShapePayload[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes));
}

export function clearShapes() {
  localStorage.removeItem(STORAGE_KEY);
}