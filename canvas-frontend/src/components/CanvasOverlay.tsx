import { Menu, Loader2 } from "lucide-react"; // Import Loader2
import { Toolbar } from "./Toolbar";
import type { ToolType } from "../types/tools";

interface CanvasOverlayProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isHandMode: boolean;
  onToggleHandMode: () => void;
  onOpenSidebar: () => void;
  // --- NEW PROP ---
  isHandLoading: boolean; 
}

export function CanvasOverlay({
  selectedTool,
  onSelectTool,
  isHandMode,
  onToggleHandMode,
  onOpenSidebar,
  isHandLoading, // Destructure new prop
}: CanvasOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none p-4">
      
      {/* 1. TOP LEFT: Menu Button */}
      <div className="absolute top-4 left-4 pointer-events-auto ">
        <button
          onClick={onOpenSidebar}
          className="p-3 bg-neutral-800/90 hover:bg-neutral-700 text-white rounded-xl shadow-lg border border-neutral-700 transition-all active:scale-95 group"
        >
          <Menu size={24} className="group-hover:text-purple-400 transition-colors" />
        </button>
      </div>

      {/* 2. TOP CENTER: Toolbar */}
      <div className="pointer-events-auto flex justify-center w-full">
        <Toolbar selectedTool={selectedTool} onSelect={onSelectTool} />
      </div>

      {/* 3. TOP RIGHT: Hand Tracking Toggle */}
      <div className="absolute top-4 right-4 pointer-events-auto z-50">
        <button
          onClick={onToggleHandMode}
          disabled={isHandLoading} // Disable click while loading
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border ${
            isHandLoading 
              ? "bg-neutral-800 border-neutral-600 text-neutral-400 cursor-wait"
              : isHandMode
                ? "bg-red-600/20 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : "bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:border-neutral-500"
          }`}
        >
          {/* LOGIC: Show Spinner if loading, else show Status Dot */}
          {isHandLoading ? (
             <Loader2 size={16} className="animate-spin text-purple-400" />
          ) : (
             <span className={`w-2 h-2 rounded-full ${isHandMode ? "bg-red-500 animate-pulse" : "bg-neutral-600"}`} />
          )}
          
          {/* TEXT LOGIC */}
          {isHandLoading 
            ? "Initializing AI..." 
            : isHandMode 
                ? "Stop Tracking" 
                : "Hand Mode (Beta)"
          }
        </button>
      </div>

    </div>
  );
}