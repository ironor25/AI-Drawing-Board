// tools/useTool.ts
import { useState } from "react";
import type { ToolType } from "../types/tools";


export function useTool(initialTool: ToolType ) {
  const [tool, setTool] = useState<ToolType>(initialTool);

  return {
    tool,
    setTool,
    isActive: (t: ToolType) => tool === t,
  };
}
