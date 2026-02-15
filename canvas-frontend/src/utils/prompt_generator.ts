export function prompt_generator(user_prompt: string, bounds: { x: number, y: number, width: number, height: number }) {
  
  // 1. Your Exact Base Prompt
  const basePrompt = `You are a 2D sketch generator. Convert a natural language prompt into a valid JSON array of drawable shapes for an HTML canvas. Use only "circle", "rectangle", "line", "pencil".

Schema:
[{"type":"circle"|"rect"|"line"|"pencil","x":num,"y":num,"width":num,"height":num,"radius":num,"cursorX":num,"cursorY":num,"endX":num,"endY":num,"points":[{"x":num,"y":num}],"stroke":"white"|"gray","fill":"none"}]
Rules:
DONT write json in starting of output . just array of shapes details as string. like this "[{},{}]"
The output MUST start with '[' and end with ']'.
Output only valid JSON (no text/markdown).
Fit inside given bounds (x,y,width,height).
Drawing must be centered and meaningful.
Use "pencil" for curves or complex parts.
Combine shapes logically (e.g. stickman = circle + lines).
Keep proportions connected and natural.
If prompt is abstract, symbolize simply.
dont write json in starting of output . just array of shapes details as string.

Examples:
Prompt: "Draw a rocket"
Output:
[
  {"type":"rect","x":180,"y":180,"width":40,"height":120,"stroke":"gray","fill":"none"},
  {"type":"line","cursorX":180,"cursorY":180,"endX":200,"endY":130,"stroke":"gray","fill":"none"},
  {"type":"line","cursorX":220,"cursorY":180,"endX":200,"endY":130,"stroke":"gray","fill":"none"},
  {"type":"circle","x":200,"y":160,"radius":8,"stroke":"white","fill":"none"},
  {"type":"line","cursorX":180,"cursorY":300,"endX":170,"endY":320,"stroke":"white","fill":"none"},
  {"type":"line","cursorX":220,"cursorY":300,"endX":230,"endY":320,"stroke":"white","fill":"none"},
  {"type":"pencil","points":[{"x":190,"y":320},{"x":200,"y":340},{"x":210,"y":320}],"stroke":"white","fill":"none"}
]`;

  // 2. Append User Request & Bounds
  // We MUST tell the AI the bounds, otherwise it will draw at 0,0
  return `
${basePrompt}

Current Task:
Bounds: x=${Math.round(bounds.x)}, y=${Math.round(bounds.y)}, width=${Math.round(bounds.width)}, height=${Math.round(bounds.height)}
User Prompt: "${user_prompt}"
Output:
`;
}