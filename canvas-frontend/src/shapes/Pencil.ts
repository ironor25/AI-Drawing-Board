import { ShapeClass } from "./Shape";

export class PencilShape extends ShapeClass {
  type = "pencil"
  points: { x: number; y: number }[]

  constructor(
    id: string,
    x: number,
    y: number,
    points: { x: number; y: number }[],
    stroke?: string,
    fill?: string
  ) {
    super(id, x, y, stroke, fill)
    this.points = points
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = this.stroke
    ctx.lineWidth = 2

    if (this.points.length === 1) {
      const p = this.points[0]
      ctx.beginPath()
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
      ctx.fillStyle = this.stroke
      ctx.fill()
      return
    }

    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)

    for (let i = 1; i < this.points.length - 1; i++) {
      const curr = this.points[i]
      const next = this.points[i + 1]
      const xc = (curr.x + next.x) / 2
      const yc = (curr.y + next.y) / 2
      ctx.quadraticCurveTo(curr.x, curr.y, xc, yc)
    }

    const last = this.points[this.points.length - 1]
    ctx.lineTo(last.x, last.y)
    ctx.stroke()
  }
}
