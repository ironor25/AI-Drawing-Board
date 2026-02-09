/**
 * viewport.ts
 * Handles canvas pan and zoom functionality
 */

export interface ViewportState {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export class Viewport {
  private offsetX: number = 0;
  private offsetY: number = 0;
  private zoom: number = 1;
  private minZoom: number = 0.1;
  private maxZoom: number = 5;

  pan(dx: number, dy: number): void {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  zooming(
    deltaY: number,
    mouseX: number,
    mouseY: number
    ): void {
    const zoomIntensity = 0.001;

    const delta = -deltaY * zoomIntensity;
    const newZoom = this.zoom * (1 + delta);

    const clampedZoom = Math.min(
        this.maxZoom,
        Math.max(this.minZoom, newZoom)
    );

    const worldX = (mouseX - this.offsetX) / this.zoom;
    const worldY = (mouseY - this.offsetY) / this.zoom;

    this.offsetX = mouseX - worldX * clampedZoom;
    this.offsetY = mouseY - worldY * clampedZoom;

    this.zoom = clampedZoom;
}
  getOffsetX(): number {
    return this.offsetX;
  }

  getOffsetY(): number {
    return this.offsetY;
  }

  getZoom(): number {
    return this.zoom;
  }

  getState(): ViewportState {
    return {
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      zoom: this.zoom,
    };
  }

  setState(state: ViewportState): void {
    this.offsetX = state.offsetX;
    this.offsetY = state.offsetY;
    this.zoom = state.zoom;
  }

  translateCanvasCoordinates(
    canvasX: number,
    canvasY: number,
  ): [number, number] {
    return [
      (canvasX - this.offsetX) / this.zoom,
      (canvasY - this.offsetY) / this.zoom,
    ];
  }

  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.zoom, this.zoom);
  }
}
