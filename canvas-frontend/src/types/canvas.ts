import type { ToolType } from "./tools";

// types/canvas.ts
export interface CanvasViewport {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface CanvasState {
  activeTool: ToolType;
  isDrawing: boolean;
}
