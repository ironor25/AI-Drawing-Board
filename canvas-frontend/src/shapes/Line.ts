import { ShapeClass } from "./Shape";

export class LineShape extends ShapeClass {
  type = "line"
  cursorX: number
  cursorY: number

  constructor(
    id: string,
    cursorX: number,
    cursorY: number,
    x: number,
    y: number,
    stroke?: string,
    fill?: string
  ) {
    super(id, x, y, stroke, fill)
    this.cursorX = cursorX
    this.cursorY = cursorY
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.moveTo(this.cursorX, this.cursorY)
    ctx.lineTo(this.x, this.y)
    ctx.strokeStyle = this.stroke
    ctx.stroke()
  }
}
