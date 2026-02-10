import { useEffect, useRef, useState } from "react";
import { InitDraw } from "./core/InitDraw";
import { CanvasOverlay } from "../components/CanvasOverlay";
import { Sidebar } from "../components/SideBar";
import type { ToolType } from "../types/tools";
import { GestureManager } from "./managers/GestureManager"; // Ensure path is correct

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>("rect");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isHandMode, setIsHandMode] = useState(false);
  
  // We use Refs for managers to avoid re-renders, but State for InitDraw if you need it in UI
  const [canvasManager, setCanvasManager] = useState<InitDraw | null>(null);
  const gestureManagerRef = useRef<GestureManager | null>(null);

  // 1. Initialize Canvas Engine (Runs once)
  useEffect(() => {
    if (!canvasRef.current) return;

    const draw = new InitDraw(canvasRef.current);
    setCanvasManager(draw);

    return () => {
      draw.cleanup();
    };
  }, []);

  // 3. Handle Hand Tracking Toggle
  useEffect(() => {
    if (isHandMode && canvasRef.current) {
      // Start Tracking
      gestureManagerRef.current = new GestureManager(canvasRef.current);
    } else {
      // Stop Tracking
      if (gestureManagerRef.current) {
        // Ideally, add a stop() method to GestureManager to close webcam stream
        // gestureManagerRef.current.stop(); 
        gestureManagerRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      // gestureManagerRef.current?.stop();
      gestureManagerRef.current = null;
    };
  }, [isHandMode]);


    const handleSelectTool = (tool: ToolType) => {
      // 1. INTERCEPT: Check if the user clicked the Trash icon
      if (tool === "trash") {
          // Run the clear logic directly from your manager
          canvasManager?.clearCanvas();
          
          // EXIT: We return early so 'selectedTool' stays on 
          // whatever the user was already using (pencil, rect, etc.)
          return; 
      }

      // 2. NORMAL TOOLS: If it wasn't trash, switch tools as usual
      setSelectedTool(tool);
      canvasManager?.setTool(tool);
  }

  return (
    <div className="relative overflow-hidden w-full h-screen bg-neutral-900">
      <canvas
        ref={canvasRef}
        className="block touch-none"
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
      />

      <CanvasOverlay
        selectedTool={selectedTool}
        onSelectTool={handleSelectTool}
        isHandMode={isHandMode}
        onToggleHandMode={() => setIsHandMode(!isHandMode)}
        onOpenSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* 3. The Sidebar itself */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Optional: Visual Indicator when Hand Mode is active */}
      {isHandMode && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse pointer-events-none">
          ● Live Tracking
        </div>
      )}
    </div>
  );
}