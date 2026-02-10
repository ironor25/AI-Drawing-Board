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
  const [isHandLoading, setIsHandLoading] = useState(false);
  const [isHandMode, setIsHandMode] = useState(false);
  
  // We use Refs for managers to avoid re-renders, but State for InitDraw if you need it in UI
  const [canvasManager, setCanvasManager] = useState<InitDraw | null>(null);
  const gestureManagerRef = useRef<GestureManager | null>(null);

  const toggleHandMode = () => {
    if (isHandLoading) return; // Prevent spam clicking
    
    if (!isHandMode) {
       // user wants to turn ON -> Start Loading
       setIsHandLoading(true);
       setIsHandMode(true);
    } else {
       // user wants to turn OFF -> Instant
       setIsHandMode(false);
       setIsHandLoading(false);
    }
  };

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
        // Start...
        gestureManagerRef.current = new GestureManager(
            () => setIsHandLoading(false)
        );
    } else {
        // Stop...
        if (gestureManagerRef.current) {
            gestureManagerRef.current.stop(); // <--- THIS MUST RUN
            gestureManagerRef.current = null;
        }
        setIsHandLoading(false);
    }

    // Cleanup on Unmount (e.g. navigating away)
    return () => {
        if (gestureManagerRef.current) {
            gestureManagerRef.current.stop();
        }
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
          // Pass the new toggle and state
          onToggleHandMode={toggleHandMode} 
          isHandLoading={isHandLoading}
          onOpenSidebar={() => setIsSidebarOpen(prev => !prev)}
       />

      {/* 3. The Sidebar itself */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      

    
    </div>
  );
}