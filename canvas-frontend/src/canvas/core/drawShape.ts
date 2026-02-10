import { RectangleShape } from "../../shapes/Rectangle"
import { CircleShape } from "../../shapes/Circle";
import { LineShape } from "../../shapes/Line";
import { PencilShape } from "../../shapes/Pencil";
import { TextShape } from "../../shapes/Text";
import type { ShapePayload } from "../../types/shape";


export function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: ShapePayload
) {
  switch (shape.type) {
    case "rectangle": {
      const rect = new RectangleShape(
        shape.type,
        shape.x,
        shape.y,
        shape.width,
        shape.height,
        shape.stroke,
        shape.fill
      );
      rect.draw(ctx);
      break;
    }

    case "circle": {
      const circle = new CircleShape(
        shape.type,
        shape.x,
        shape.y,
        shape.radius,
        shape.stroke,
        shape.fill
      );
      circle.draw(ctx);
      break;
    }

    case "line": {
      const line = new LineShape(
        shape.type,
        shape.cursorX,
        shape.cursorY,
        shape.x,
        shape.y,
        shape.stroke
      );
      line.draw(ctx);
      break;
    }

    case "pencil": {
      const pencil = new PencilShape(
        shape.type,
        0,
        0,
        shape.points,
        shape.stroke
      );
      pencil.draw(ctx);
      break;
    }
    case "text": {
      const text =  new TextShape(
          shape.type,
          shape.x,
          shape.y,
          shape.text,
          shape.fontSize,
          shape.stroke
          );
          text.draw(ctx);
          break;
        }

    default: {
      // Exhaustive check — if ShapePayload changes, TS will complain here
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
