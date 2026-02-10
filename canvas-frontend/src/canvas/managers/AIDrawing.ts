// import axios from "axios";
// import { nanoid } from "nanoid";
// import { BACKEND_URL } from "../../utils/config"; // Adjust path
import type { ShapePayload } from "../../types/shape";
import type { Viewport } from "../core/viewport";

export class AIManager {
    private canvas: HTMLCanvasElement;
    private viewport: Viewport;
    private onShapesReceived: (shapes: ShapePayload[]) => void;
    private activeOverlay: HTMLDivElement | null = null;

    constructor(
        canvas: HTMLCanvasElement, 
        viewport: Viewport, 
        onReceive: (s: ShapePayload[]) => void
    ) {
        this.canvas = canvas;
        this.viewport = viewport;
        this.onShapesReceived = onReceive;
    }

    public openPrompt(worldX: number, worldY: number, width: number, height: number) {
        // 1. Remove any existing AI box
        this.close();

        // 2. Math: Convert World Box -> Screen Box
        const zoom = this.viewport.getZoom();
        const rect = this.canvas.getBoundingClientRect();
        
        const screenX = (worldX * zoom) + this.viewport.getOffsetX() + rect.left;
        const screenY = (worldY * zoom) + this.viewport.getOffsetY() + rect.top;
        const screenW = width * zoom;
        const screenH = height * zoom;

        // 3. Create the Container (The "Box" user just drew)
        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
            position: "fixed",
            left: `${screenX}px`,
            top: `${screenY}px`,
            width: `${screenW}px`,
            height: `${screenH}px`,
            zIndex: "10000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            background: "rgba(138, 43, 226, 0.1)", // Light purple tint
            border: "2px dashed #8A2BE2",
            borderRadius: "8px",
            backdropFilter: "blur(2px)",
            padding: "10px"
        });

        // 4. Create Input Field
        const input = document.createElement("textarea");
        input.placeholder = "Describe what to draw inside this box...";
        Object.assign(input.style, {
            width: "90%",
            height: "60px",
            background: "rgba(0,0,0,0.8)",
            border: "1px solid #555",
            color: "white",
            borderRadius: "6px",
            padding: "8px",
            resize: "none",
            outline: "none",
            fontSize: "14px",
            fontFamily: "sans-serif"
        });

        // 5. Create Button
        const button = document.createElement("button");
        button.textContent = "Generate ✨";
        Object.assign(button.style, {
            padding: "8px 16px",
            background: "#8A2BE2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px"
        });

        // 6. Append
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        document.body.appendChild(wrapper);
        this.activeOverlay = wrapper;

        // Focus input
        setTimeout(() => input.focus(), 0);

        // --- Logic ---

        const handleGenerate = async () => {
            const prompt = input.value.trim();
            if (!prompt) return;

            // LOADING STATE
            input.disabled = true;
            button.disabled = true;
            button.textContent = "Dreaming... ⏳";
            button.style.background = "#555";
            wrapper.style.cursor = "wait";

            try {
                // Fetch from Backend
                const shapes = await this.fetchShapes(prompt, worldX, worldY, width, height);
                
                // Success: Return data and Close
                if (shapes && shapes.length > 0) {
                    this.onShapesReceived(shapes);
                    this.close(); 
                } else {
                    throw new Error("No shapes returned");
                }
            } catch (err) {
                console.error(err);
                button.textContent = "Failed ❌";
                button.style.background = "red";
                setTimeout(() => {
                    button.textContent = "Try Again";
                    button.disabled = false;
                    input.disabled = false;
                    button.style.background = "#8A2BE2";
                }, 2000);
            }
        };

        // Click or Ctrl+Enter to submit
        button.onclick = handleGenerate;
        input.onkeydown = (e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            if (e.key === "Escape") this.close();
        };
        
        // Close if clicked outside
        const handleOutside = (e: MouseEvent) => {
             if (!wrapper.contains(e.target as Node)) this.close();
        };
        setTimeout(() => window.addEventListener("mousedown", handleOutside), 100);
    }

    public close() {
        if (this.activeOverlay) {
            this.activeOverlay.remove();
            this.activeOverlay = null;
        }
    }

    private async fetchShapes(prompt: string, x: number, y: number, w: number, h: number): Promise<ShapePayload[]> {
        // ... (Same axios logic as before) ...
        // Ensure you pass `x, y, w, h` in the prompt so backend knows the boundary
        
        try {
             // Mocking backend for logic test (Replace with your axios call)
             // const response = await axios.post(...)
             
             return []; 
        } catch (e) {
            throw e;
        }
    }
}