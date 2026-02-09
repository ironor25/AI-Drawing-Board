import { ShapeClass } from "./Shape";

export class CircleShape extends ShapeClass {
  type = "circle"
  radius: number

  constructor(
    id: string,
    x: number,
    y: number,
    radius: number,
    stroke?: string,
    fill?: string
  ) {
    super(id, x, y, stroke, fill)
    this.radius = radius
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.strokeStyle = this.stroke
    ctx.stroke()
    ctx.closePath()
  }
}
