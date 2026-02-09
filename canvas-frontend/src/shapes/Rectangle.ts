import { ShapeClass } from "./Shape";

export class RectangleShape extends ShapeClass {
  type = "rectangle"
  width: number
  height: number

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    stroke?: string,
    fill?: string
  ) {
    super(id, x, y, stroke, fill)
    this.width = width
    this.height = height
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.stroke
    ctx.fillStyle = this.fill
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }
}
