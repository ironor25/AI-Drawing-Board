/**
 * useCanvasEvents.ts
 * Imperative canvas event binder (NOT a React hook)
 */

export type CanvasEventHandlers = {
  onMouseDown?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onWheel?: (e: WheelEvent) => void;
};

export function bindCanvasEvents(
  canvas: HTMLCanvasElement,
  handlers: CanvasEventHandlers
) {
  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = handlers;

  if (onMouseDown) canvas.addEventListener("mousedown", onMouseDown);
  if (onMouseMove) canvas.addEventListener("mousemove", onMouseMove);
  if (onMouseUp) canvas.addEventListener("mouseup", onMouseUp);
  if (onWheel) canvas.addEventListener("wheel", onWheel, { passive: false });

  // return cleanup
  return () => {
    if (onMouseDown) canvas.removeEventListener("mousedown", onMouseDown);
    if (onMouseMove) canvas.removeEventListener("mousemove", onMouseMove);
    if (onMouseUp) canvas.removeEventListener("mouseup", onMouseUp);
    if (onWheel) canvas.removeEventListener("wheel", onWheel);
  };
}
