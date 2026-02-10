export function prompt_generator(user_prompt: string, bounds: { x: number, y: number, width: number, height: number }) {
  return `
    Role: Technical Sketch API.
    Task: Convert the user request into a raw JSON array of drawing primitives.
    
    Constraints:
    1. Output strictly valid JSON. NO markdown (e.g. \`\`\`json), NO explanatory text.
    2. Coordinate System: Use the provided bounds: x=${bounds.x}, y=${bounds.y}, width=${bounds.width}, height=${bounds.height}. All shapes MUST be inside these values.
    3. Supported Tools:
       - "rect": { "type":"rect", "x":num, "y":num, "width":num, "height":num, "stroke":"white", "fill":"transparent" }
       - "circle": { "type":"circle", "x":num, "y":num, "radius":num, "stroke":"white", "fill":"transparent" }
       - "line": { "type":"line", "x":num, "y":num, "points":[{"x":num,"y":num}, {"x":num,"y":num}], "stroke":"white" } 
       - "pencil": { "type":"pencil", "points":[{"x":num,"y":num},...], "stroke":"white" }

    Style:
    - Simple, icon-style technical sketches.
    - Use "pencil" for curves or irregular shapes.
    - Center the drawing within the provided bounds.

    User Request: "${user_prompt}"
  `;
}