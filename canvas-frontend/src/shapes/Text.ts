// TextShape.ts
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT } from "../utils/config";
import { ShapeClass } from "./Shape";

export class TextShape extends ShapeClass {
  type = "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string; // Add this

  constructor(
    id: string,
    x: number,
    y: number,
    text: string,
    fontSize = DEFAULT_FONT_SIZE, // Use constant
    stroke = "white",
    fontFamily = DEFAULT_FONT_FAMILY, // Use constant
    fontWeight = DEFAULT_FONT_WEIGHT // Use constant
  ) {
    super(id, x, y, stroke, "transparent");
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.fontWeight = fontWeight;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.stroke;
    // Construct the font string: "bold 50px cursive"
    ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    ctx.textBaseline = "top"; // Crucial for matching HTML input position
    ctx.fillText(this.text, this.x, this.y);
  }
}