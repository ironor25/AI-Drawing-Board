import { useEffect, useRef, useState } from "react";
import { InitDraw } from "./InitDraw";
import { CanvasOverlay } from "../components/CanvasOverlay";
import type { ToolType } from "../types/tools";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>("rect");
  const [canvasManager, setCanvasManager] = useState<InitDraw | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const draw = new InitDraw(canvasRef.current);
    setCanvasManager(draw);

    return () => {
      draw.cleanup();
    };
  }, []);

  const handleSelectTool = (tool: ToolType) => {
    setSelectedTool(tool);
    canvasManager?.setTool(tool);
  };

  return (
    <div className="relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <CanvasOverlay
        selectedTool={selectedTool}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
