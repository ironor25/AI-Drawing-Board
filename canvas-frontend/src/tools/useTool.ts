// tools/useTool.ts
import { useState } from "react";
import type { ToolType } from "./ToolTypes";

export function useTool(initialTool: ToolType = "rect") {
  const [tool, setTool] = useState<ToolType>(initialTool);

  return {
    tool,
    setTool,
    isActive: (t: ToolType) => tool === t,
  };
}
