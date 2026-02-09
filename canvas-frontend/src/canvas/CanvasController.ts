import type { ShapePayload } from "../types/shape";
import { drawShape } from "./drawShape";

export class CanvasController {
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.ctx = ctx;
    this.canvas = canvas
  }

  clear(scale = 1, offsetX = 0, offsetY = 0) {
    // reset transform
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // apply viewport transform
    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  }

  drawAll(shapes: ShapePayload[]) {
    for (const shape of shapes) {
      drawShape(this.ctx, shape);
    }
  }
}
