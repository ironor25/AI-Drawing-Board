import { Toolbar } from "./Toolbar";

type Tool =
  | "circle"
  | "rect"
  | "pencil"
  | "line"
  | "text"
  | "AI"
  | "pan"
  | "eraser";

export function CanvasOverlay({
  selectedTool,
  onSelectTool,
}: {
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
}) {
  return (
    <>
      <Toolbar selectedTool={selectedTool} onSelect={onSelectTool} />
      {/* Later:
          <LiveButton />
          <ZoomIndicator />
          <SelectionBox />
      */}
    </>
  );
}
