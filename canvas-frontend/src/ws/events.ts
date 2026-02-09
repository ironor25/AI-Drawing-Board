/**
 * events.ts
 * Maps canvas events to WebSocket messages
 */

export interface CanvasEventMessage {
  type: "draw" | "shape" | "clear" | "update" | "delete";
  data: any;
  timestamp: number;
}

export const createEventMessage = (
  type: CanvasEventMessage["type"],
  data: any,
): CanvasEventMessage => {
  return {
    type,
    data,
    timestamp: Date.now(),
  };
};

export const mapShapeToEvent = (shape: any): CanvasEventMessage => {
  return createEventMessage("shape", {
    id: shape.id,
    type: shape.type,
    data: shape.toData(),
  });
};

export const mapDeleteToEvent = (shapeId: string): CanvasEventMessage => {
  return createEventMessage("delete", { id: shapeId });
};

export const mapClearToEvent = (): CanvasEventMessage => {
  return createEventMessage("clear", {});
};
