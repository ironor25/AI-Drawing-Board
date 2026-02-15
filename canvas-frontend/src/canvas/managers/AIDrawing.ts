import axios from "axios";
import type { ShapePayload } from "../../types/shape";
import type { Viewport } from "../core/viewport";
import { BACKEND_URL } from "../../utils/config";
import { prompt_generator } from "../../utils/prompt_generator"; 

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

        // 3. Create the Container
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
            padding: "10px",
            boxSizing: "border-box" // Critical for padding
        });

        // 4. Create Input Field
        const input = document.createElement("textarea");
        input.placeholder = "Describe what to draw...";
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
            fontSize: "13px",
            transition: "background 0.2s"
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
                
                // Reset after 2 seconds
                setTimeout(() => {
                    button.textContent = "Generate ✨";
                    button.disabled = false;
                    input.disabled = false;
                    button.style.background = "#8A2BE2";
                    wrapper.style.cursor = "default";
                    input.focus();
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
             if (this.activeOverlay && !this.activeOverlay.contains(e.target as Node)) {
                this.close();
             }
        };
        // Delay listener to prevent immediate closing
        setTimeout(() => window.addEventListener("mousedown", handleOutside), 100);
    }

    public close() {
        if (this.activeOverlay) {
            this.activeOverlay.remove();
            this.activeOverlay = null;
        }
    }

    private async fetchShapes(userPrompt: string, x: number, y: number, w: number, h: number): Promise<ShapePayload[]> {
        // Uncomment if you have auth
        // const token = localStorage.getItem("token");

        // 1. USE THE PROMPT GENERATOR
        // This creates the strict JSON schema prompt we defined earlier
        const fullPrompt = prompt_generator(userPrompt, {
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(w),
            height: Math.round(h)
        });

        try {
            // 2. Hit Backend
            const response = await axios.post(
                `${BACKEND_URL}/api/generate`, 
                { prompt: fullPrompt }
            );

            // 3. Parse Response
            const result = response.data.result;

            if (Array.isArray(result)) {
                return result as ShapePayload[];
            } 

            return [];
        } catch (e) {
            console.error("AI Generation Error:", e);
            throw e;
        }
    }
}