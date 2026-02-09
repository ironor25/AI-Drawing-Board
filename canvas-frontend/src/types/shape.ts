// types/shape.ts

export type ShapeType =
  | "rectangle"
  | "circle"
  | "line"
  | "pencil"
  | "text"
  | "ai";

export interface Point {
  x: number;
  y: number;
}

/**
 * Minimal serializable shape payload
 * (used for storage, replay, websocket later)
 */
export type ShapePayload =
  | {
      type: "rectangle";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      stroke?: string;
      fill?: string;
    }
  | {
      type: "circle";
      id: string;
      x: number;
      y: number;
      radius: number;
      stroke?: string;
      fill?: string;
    }
  | {
      type: "line";
      id: string;
      cursorX: number;
      cursorY: number;
      x: number;
      y: number;
      stroke?: string;
    }
  | {
      type: "pencil";
      id: string;
      points: Point[];
      stroke?: string;
    }
  | {
      type: "text";
      id: string;
      x: number;
      y: number;
      text: string;
      fontSize?: number;
      stroke?: string;
    };
