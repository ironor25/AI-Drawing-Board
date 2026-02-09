/**
 * events.ts
 * Type definitions for events
 */

export interface CanvasEvent {
  type:
    | "mousedown"
    | "mousemove"
    | "mouseup"
    | "wheel"
    | "keydown"
    | "keyup"
    | "touch";
  x: number;
  y: number;
  timestamp: number;
  key?: string;
  button?: number;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

export interface DrawEvent extends CanvasEvent {
  type: "mousedown" | "mousemove" | "mouseup";
  pressure?: number;
}

export interface WheelEvent extends CanvasEvent {
  type: "wheel";
  deltaY: number;
}

export interface KeyEvent extends CanvasEvent {
  type: "keydown" | "keyup";
  key: string;
}

export type AnyCanvasEvent = DrawEvent | WheelEvent | KeyEvent;
