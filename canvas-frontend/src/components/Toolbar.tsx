import type { ToolType } from "../types/tools";
import { IconButton } from "./Icons";
import { Brain, Circle, Eraser, Hand, Pencil, RectangleHorizontalIcon, Slash, Trash, Type } from "lucide-react";

export function Toolbar({
  selectedTool,
  onSelect,
}: {
  selectedTool: ToolType;
  onSelect: (tool: ToolType) => void;
}) {

    
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-hidden bg-purple-300 rounded-xl">
      <IconButton icon={<Hand />} onClick={() => onSelect("pan")} activated={selectedTool === "pan"} />
      <IconButton icon={<Pencil />} onClick={() => onSelect("pencil")} activated={selectedTool === "pencil"} />
      <IconButton icon={<Slash />} onClick={() => onSelect("line")} activated={selectedTool === "line"} />
      <IconButton icon={<RectangleHorizontalIcon />} onClick={() => onSelect("rect")} activated={selectedTool === "rect"} />
      <IconButton icon={<Circle />} onClick={() => onSelect("circle")} activated={selectedTool === "circle"} />
      <IconButton icon={<Type />} onClick={() => onSelect("text")} activated={selectedTool === "text"} />
      <IconButton icon={<Brain />} onClick={() => onSelect("AI")} activated={selectedTool === "AI"} />
      <IconButton icon={<Eraser />} onClick={() => onSelect("eraser")} activated={selectedTool === "eraser"} />
      <IconButton icon={<Trash />} onClick={() => onSelect("trash")} activated={selectedTool === "trash"} />
    </div>
  );
}
