/**
 * ToolManager.ts
 * Manages which tool is currently active
 */

export type ToolType =
  | "pencil"
  | "rectangle"
  | "circle"
  | "line"
  | "select"
  | "eraser";

export class ToolManager {
  private currentTool: ToolType = "pencil";

  setTool(tool: ToolType): void {
    this.currentTool = tool;
  }

  getTool(): ToolType {
    return this.currentTool;
  }

  isPencil(): boolean {
    return this.currentTool === "pencil";
  }

  isRectangle(): boolean {
    return this.currentTool === "rectangle";
  }

  isCircle(): boolean {
    return this.currentTool === "circle";
  }

  isLine(): boolean {
    return this.currentTool === "line";
  }

  isSelect(): boolean {
    return this.currentTool === "select";
  }

  isEraser(): boolean {
    return this.currentTool === "eraser";
  }
}
