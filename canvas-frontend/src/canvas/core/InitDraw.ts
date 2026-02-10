import type { ShapePayload } from "../../types/shape";
import type { ToolType } from "../../types/tools";
import { AIManager } from "../managers/AIDrawing";
import { clearShapes, loadShapes, saveShapes } from "../../storage/local";
import { CanvasController } from "./CanvasController";
import { bindCanvasEvents } from "../../hooks/useCanvasEvents";
import { Viewport } from "./viewport";

import { nanoid } from "nanoid";
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WEIGHT,
} from "../../utils/config";
import { GestureManager } from "../managers/GestureManager";

export class InitDraw {
  private shapes: ShapePayload[] = [];
  private tool: ToolType = "rect";
  private controller: CanvasController;
  private viewport: Viewport;
  private cleanupEvents: (() => void) | null = null;
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private points: { x: number; y: number }[] = [];
  private canvas: HTMLCanvasElement;
  private isPanning = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private activeTextInput: HTMLTextAreaElement | null = null;
  private textStart: { x: number; y: number } | null = null;
  private gestureManager: GestureManager | null = null;
  private aiManager: AIManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context missing");

    this.controller = new CanvasController(canvas, ctx);
    this.viewport = new Viewport();

    // load shapes from localStorage
    this.shapes = loadShapes();

    this.redraw();
    this.handleResize();

    // 3. LISTEN: Start watching for window changes
    window.addEventListener("resize", this.handleResize);


    this.aiManager = new AIManager(canvas, this.viewport, (newShapes :any) => {
            // Callback: This runs when AI finishes
            this.shapes.push(...newShapes);
            saveShapes(this.shapes);
            this.redraw();
        });


    // bind canvas events
    this.cleanupEvents = bindCanvasEvents(canvas, {
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove,
      onMouseUp: this.onMouseUp,
      onWheel: this.onWheel,
    });
  }

  /* ---------- public API ---------- */

    setTool(tool: ToolType) {
      this.tool = tool;
    }

    cleanup() {
      this.cleanupEvents?.();
      window.removeEventListener("resize", this.handleResize);
    }

    // --- ADD THIS METHOD ---
    public clearCanvas() {

        if (!window.confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
            return;
        }
        // 1. Clear Memory
        this.shapes = [];
        
        // 2. Clear Storage
        clearShapes();
        
        // 3. Clear Screen (Redraw with empty array)
        this.redraw();
    }

    public toggleHandTracking(enable: boolean) {
          if (enable) {
              if (!this.gestureManager) {
                  this.gestureManager = new GestureManager();
              }
          } else {
              // You'd need to add a cleanup/stop method to GestureManager
              // this.gestureManager.stop(); 
          }
      }
    

  /* ---------- event handlers ---------- */

  private handleResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.redraw();
  };

  private onMouseDown = (e: MouseEvent) => {
    const [x, y] = this.getWorldCoords(e);

    if (this.tool === "pan") {
      this.isPanning = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      return;
    }

    if (this.tool === "text") {
      // 1. If text editor is open, commit the current one first
      if (this.activeTextInput) {
        this.commitText();
      }
      // 2. Open new editor at the clicked WORLD coordinates
      this.openTextEditor(x, y);
      return;
    }

    if (this.tool === "eraser") {
      this.isDrawing = true; // reusing this flag to track "erasing active"
      const shape = this.getShapeAtPosition(x, y);
      if (shape) {
        // Filter out the deleted shape
        this.shapes = this.shapes.filter((s) => s.id !== shape.id);
        saveShapes(this.shapes);
        this.redraw();
      }
      return;
    }
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
    this.points = [{ x, y }];
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.tool === "pan" && this.isPanning) {

      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.viewport.pan(dx, dy);
      this.redraw();
      return;
    }

    if (!this.isDrawing) return;
    const [x, y] = this.getWorldCoords(e);

    if (this.tool === "eraser") {
      const shape = this.getShapeAtPosition(x, y);
      if (shape) {
        this.shapes = this.shapes.filter((s) => s.id !== shape.id);
        saveShapes(this.shapes);
        this.redraw();
      }
      return;
    }

    let preview: ShapePayload | null = null;

    switch (this.tool) {
      case "rect": {
        preview = {
          type: "rectangle",
          id: "preview",
          x: this.startX,
          y: this.startY,
          width: x - this.startX,
          height: y - this.startY,
        };
        break;
      }

      case "circle": {
        preview = {
          type: "circle",
          id: "preview",
          x: (this.startX + x) / 2,
          y: (this.startY + y) / 2,
          radius: Math.hypot(x - this.startX, y - this.startY) / 2,
        };
        break;
      }

      case "line": {
        preview = {
          type: "line",
          id: "preview",
          cursorX: this.startX,
          cursorY: this.startY,
          x,
          y,
        };
        break;
      }

      case "pencil": {
        this.points.push({ x, y });
        preview = {
          type: "pencil",
          id: "preview",
          points: this.points,
        };
        break;
      }
      case "AI":{
             // We draw a "fake" rectangle so user sees the area
             const preview: ShapePayload = {
                 type: "rectangle",
                 id: "preview-ai",
                 x: this.startX,
                 y: this.startY,
                 width: x - this.startX,
                 height: y - this.startY,
                 stroke: "#8A2BE2", // AI Purple
                 fill: "rgba(138, 43, 226, 0.05)",
                 // Add dashed line support in your CanvasController if possible
             };
             
             // Redraw existing shapes + this preview
             this.redraw([preview]); 
             return;
        }

      default:
        return;
    }

    if (preview) {
      this.redraw([preview]);
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (this.isPanning) {
      this.isPanning = false;
      return;
    }

    if (!this.isDrawing) return;

    this.isDrawing = false;
    const [x, y] = this.getWorldCoords(e);
    if (this.tool === "AI") {
          // Calculate Box Dimensions
          const width = x - this.startX;
          const height = y - this.startY;

          // Handle negative width/height (dragging backwards)
          const realX = width < 0 ? x : this.startX;
          const realY = height < 0 ? y : this.startY;
          const absW = Math.abs(width);
          const absH = Math.abs(height);

          // Only open if box is big enough (prevent accidental clicks)
          if (absW > 20 && absH > 20) {
              this.aiManager.openPrompt(realX, realY, absW, absH);
          }
          
          // Redraw to clear the "preview" rectangle we were drawing
          this.redraw(); 
          return;
      }
    
    
    
    let shape: ShapePayload | null = null;




    switch (this.tool) {
      case "rect":
        shape = {
          type: "rectangle",
          id: nanoid(),
          x: this.startX,
          y: this.startY,
          width: x - this.startX,
          height: y - this.startY,
        };
        break;

      case "circle":
        shape = {
          type: "circle",
          id: nanoid(),
          x: (this.startX + x) / 2,
          y: (this.startY + y) / 2,
          radius: Math.hypot(x - this.startX, y - this.startY) / 2,
        };
        break;

      case "line":
        shape = {
          type: "line",
          id: nanoid(),
          cursorX: this.startX,
          cursorY: this.startY,
          x,
          y,
        };
        break;

      case "pencil":
        shape = {
          type: "pencil",
          id: nanoid(),
          points: this.points,
        };
        break;
    }

    if (!shape) return;

    this.shapes.push(shape);
    saveShapes(this.shapes);
    this.redraw();
  };

  private onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    this.viewport.zooming(e.deltaY, mouseX, mouseY);
    this.redraw();
  };

  /* ---------- helpers ---------- */

  private redraw(extra: ShapePayload[] = []) {
    this.controller.clear();
    this.viewport.applyTransform(this.controller["ctx"]);
    this.controller.drawAll([...this.shapes, ...extra]);
  }

  private getWorldCoords(e: MouseEvent): [number, number] {
    const rect = this.canvas.getBoundingClientRect();
    return this.viewport.translateCanvasCoordinates(
      e.clientX - rect.left,
      e.clientY - rect.top,
    );
  }

  private openTextEditor(worldX: number, worldY: number) {
    // Create the element
    const textarea = document.createElement("textarea");

    // Calculate Screen Coordinates: (World * Zoom) + PanOffset
    const zoom = this.viewport.getZoom();
    const offsetX = this.viewport.getOffsetX();
    const offsetY = this.viewport.getOffsetY();
    const canvasRect = this.canvas.getBoundingClientRect();

    // 2. Calculate Screen Position
    // The input must be placed where the mouse clicked on screen
    const screenX = worldX * zoom + offsetX + canvasRect.left;
    const screenY = worldY * zoom + offsetY + canvasRect.top;

    // 3. Calculate Font Size based on ZOOM
    // If zoom is 2x, text input should be 100px (50 * 2)
    const scaledFontSize = DEFAULT_FONT_SIZE * zoom;

    // --- APPLY STYLES ---
    textarea.style.position = "fixed";
    textarea.style.left = `${screenX}px`;
    textarea.style.top = `${screenY}px`;

    // MATCH CANVAS FONT EXACTLY: Weight + Size + Family
    textarea.style.font = `${DEFAULT_FONT_WEIGHT} ${scaledFontSize}px ${DEFAULT_FONT_FAMILY}`;
    textarea.style.color = "white";

    // Reset browser defaults that mess up alignment
    textarea.style.margin = "0";
    textarea.style.padding = "0";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.background = "transparent";
    textarea.style.lineHeight = "1"; // Canvas usually renders close to line-height 1
    textarea.style.overflow = "hidden";
    textarea.style.zIndex = "999999";

    // Sizing
    // Set a min-width so you can see it before typing
    textarea.style.minWidth = `${scaledFontSize * 2}px`;
    textarea.style.height = `${scaledFontSize * 1.2}px`; // Slight buffer for descenders (g, y, j)

    document.body.appendChild(textarea);
    // Focus immediately
    // We use setTimeout to ensure it happens after the render cycle
    setTimeout(() => textarea.focus(), 0);

    this.activeTextInput = textarea;
    this.textStart = { x: worldX, y: worldY }; // Save WORLD coordinates for the Shape

    // Event Listeners
    const handleBlur = () => {
      this.commitText();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Commit on Enter (unless Shift is held for new line)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.commitText();
      }
      // Cancel on Escape
      if (e.key === "Escape") {
        this.cancelText();
      }
    };

    textarea.addEventListener("blur", handleBlur);
    textarea.addEventListener("keydown", handleKeyDown);
  }
  // Helper to cleanup DOM
  private removeActiveInput() {
    if (this.activeTextInput) {
      try {
        document.body.removeChild(this.activeTextInput);
      } catch (e) {
        // Element might already be removed
      }
      this.activeTextInput = null;
    }
    this.textStart = null;
  }

  private commitText() {
    // 1. CRITICAL FIX: Grab reference locally and nullify class property IMMEDIATELY.
    // This prevents the "double-save" bug where blur fires again during cleanup.
    const input = this.activeTextInput;
    const startPos = this.textStart;

    // Guard: If already processed (null), exit.
    if (!input || !startPos) return;

    // Lock it down instantly so subsequent events (like blur) fail the guard above.
    this.activeTextInput = null;
    this.textStart = null;

    const value = input.value.trim();

    // Only save if there is text
    if (value.length > 0) {
      const shape: ShapePayload = {
        type: "text",
        id: nanoid(),
        x: startPos.x,
        y: startPos.y,
        text: value,
        // 2. FIX: Use the constants so it matches the input box style
        fontSize: DEFAULT_FONT_SIZE,
      };

      this.shapes.push(shape);
      saveShapes(this.shapes);
      this.redraw();
    }

    // Cleanup DOM manually using the local reference
    input.remove();
  }
  private cancelText() {
    this.removeActiveInput();
    this.redraw();
  }

  // Add this private method to InitDraw class
  private getShapeAtPosition(x: number, y: number): ShapePayload | null {
    // We iterate backwards to grab the top-most shape first
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];

      switch (shape.type) {
        case "rectangle": {
          // Check if point is inside the box
          // Normalize coordinates in case width/height are negative (dragged left/up)
          const minX = Math.min(shape.x, shape.x + shape.width);
          const maxX = Math.max(shape.x, shape.x + shape.width);
          const minY = Math.min(shape.y, shape.y + shape.height);
          const maxY = Math.max(shape.y, shape.y + shape.height);

          if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            return shape;
          }
          break;
        }

        case "circle": {
          // Distance formula: dist = sqrt((x2-x1)^2 + (y2-y1)^2)
          const dist = Math.hypot(x - shape.x, y - shape.y);
          if (dist <= shape.radius) return shape;
          break;
        }

        case "text": {
          // Approximate text bounds (width ≈ char count * font size * 0.6)
          const fontSize = shape.fontSize ?? DEFAULT_FONT_SIZE;
          const width = shape.text.length * fontSize * 0.6;
          const height = fontSize;
          // Text is drawn from top-left (due to our textBaseline="top" fix)
          if (
            x >= shape.x &&
            x <= shape.x + width &&
            y >= shape.y &&
            y <= shape.y + height
          ) {
            return shape;
          }
          break;
        }

        case "line": {
          // Distance from point to line segment
          const offset = 5; // buffer distance (how close you need to be)
          if (
            this.distanceToSegment(
              x,
              y,
              shape.cursorX,
              shape.cursorY,
              shape.x,
              shape.y,
            ) < offset
          ) {
            return shape;
          }
          break;
        }

        case "pencil": {
          // Check if point is close to ANY point in the pencil path
          const offset = 5;
          const hit = shape.points.some(
            (p) => Math.hypot(p.x - x, p.y - y) < offset,
          );
          if (hit) return shape;
          break;
        }
      }
    }
    return null;
  }

  // Helper for Line Hit Detection
  private distanceToSegment(
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.hypot(dx, dy);
  }
}
