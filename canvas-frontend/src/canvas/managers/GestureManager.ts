import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export class GestureManager {
    private video: HTMLVideoElement;
    //@ts-ignore
    private canvas: HTMLCanvasElement;
    private landmarker: HandLandmarker | null = null;
    private animationFrameId: number | null = null;

    // State
    private isDrawing = false;
    private lastX = 0;
    private lastY = 0;

    // Configuration
    // 0.1 = slow/smooth, 0.9 = fast/jittery. 0.5 is a good balance for drawing.
    private smoothingFactor = 0.5; 
    
    // How close index and middle finger need to be to trigger "Draw" (0.0 - 1.0)
    private drawThreshold = 0.06; 

    private screenWidth = window.innerWidth;
    private screenHeight = window.innerHeight;

    // Visual Cursor
    private cursorElement: HTMLDivElement | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        // Setup hidden video element
        this.video = document.createElement("video");
        this.video.style.display = "none";
        this.video.style.transform = "scaleX(-1)"; // Mirror internally
        document.body.appendChild(this.video);

        this.init();

        // Handle window resize to keep mapping accurate
        window.addEventListener('resize', this.updateScreenSize);
    }

    updateScreenSize = () => {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    async init() {
    const vision = await FilesetResolver.forVisionTasks(
        // Use a versioned CDN link instead of a local path
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm"
    );

    this.landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            // Also use the absolute URL for the model
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.6,
        minTrackingConfidence: 0.6
    });

    this.startWebcam();
}

    async startWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 1280,
                    height: 720,
                    frameRate: { ideal: 60 } // Request high FPS for lower latency
                } 
            });
            this.video.srcObject = stream;
            await this.video.play();
            this.loop();
        } catch (err) {
            console.error("Camera error:", err);
            alert("Camera permission denied or not available.");
        }
    }

    private loop = () => {
    // Only proceed if landmarker is ready and video is playing
        if (!this.landmarker || this.video.readyState !== 4) {
            this.animationFrameId = requestAnimationFrame(this.loop);
            return;
        }

        const startTimeMs = performance.now();
        const results = this.landmarker.detectForVideo(this.video, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
            const hand = results.landmarks[0];
                
                // 8 = Index Finger Tip
                // 12 = Middle Finger Tip
                const indexTip = hand[8];
                const middleTip = hand[12];

                this.handleGestures(indexTip, middleTip);
        }

        this.animationFrameId = requestAnimationFrame(this.loop);
    };

        

    private handleGestures(index: any, middle: any) {
        // 1. Map Coordinates (Mirrored)
        // We use the Index finger as the "Cursor"
        const targetX = (1 - index.x) * this.screenWidth;
        const targetY = index.y * this.screenHeight;

        // 2. Smooth Movement (Lerp)
        const x = this.lastX + (targetX - this.lastX) * this.smoothingFactor;
        const y = this.lastY + (targetY - this.lastY) * this.smoothingFactor;

        this.lastX = x;
        this.lastY = y;

        // 3. Update Visuals
        this.updateCursorVisual(x, y);

        // 4. Calculate Distance between Index (8) and Middle (12)
        // If they are close together -> DRAW mode
        const distance = Math.hypot(
            (1 - index.x) - (1 - middle.x), 
            index.y - middle.y
        );

        const shouldDraw = distance < this.drawThreshold;

        // 5. State Machine for Events
        if (shouldDraw && !this.isDrawing) {
            // DOWN
            this.dispatchMouseEvent("mousedown", x, y);
            this.isDrawing = true;
            this.updateCursorColor("active");
        } 
        else if (!shouldDraw && this.isDrawing) {
            // UP
            this.dispatchMouseEvent("mouseup", x, y);
            this.isDrawing = false;
            this.updateCursorColor("idle");
        } 
        else if (this.isDrawing) {
            // DRAG
            this.dispatchMouseEvent("mousemove", x, y);
        } 
        else {
            // HOVER
            this.dispatchMouseEvent("mousemove", x, y);
        }
    }

    private dispatchMouseEvent(type: string, x: number, y: number) {
        // Hide cursor briefly so we don't click "on ourselves"
        // (Though pointer-events: none should handle this, this is a safety check)
        if (this.cursorElement) this.cursorElement.style.display = 'none';
        
        const element = document.elementFromPoint(x, y);
        
        if (this.cursorElement) this.cursorElement.style.display = 'block';

        if (element) {
            element.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y
            }));
        }
    }

    // --- Visuals ---
    private updateCursorVisual(x: number, y: number) {
        if (!this.cursorElement) {
            this.cursorElement = document.createElement("div");
            Object.assign(this.cursorElement.style, {
                width: "15px", 
                height: "15px",
                backgroundColor: "rgba(255, 50, 50, 0.8)", // Red (Idle)
                borderRadius: "50%",
                position: "fixed", 
                pointerEvents: "none", // CRITICAL: Lets clicks pass through to Navbar
                zIndex: "9999999",     // CRITICAL: Above Navbar
                border: "2px solid white", 
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                transition: "background-color 0.1s"
            });
            document.body.appendChild(this.cursorElement);
        }
        this.cursorElement.style.left = `${x}px`;
        this.cursorElement.style.top = `${y}px`;
    }

    private updateCursorColor(state: "idle" | "active") {
        if (!this.cursorElement) return;
        // Green when drawing, Red when hovering
        this.cursorElement.style.backgroundColor = 
            state === "active" ? "#00ff00" : "rgba(255, 50, 50, 0.8)";
        
        // Scale effect
        this.cursorElement.style.transform = 
            state === "active" ? "translate(-50%, -50%) scale(0.8)" : "translate(-50%, -50%) scale(1)";
    }

    public stop() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        if (this.video.srcObject) {
            const tracks = (this.video.srcObject as MediaStream).getTracks();
            tracks.forEach(t => t.stop());
        }
        
        this.video.remove();
        if (this.cursorElement) this.cursorElement.remove();
        window.removeEventListener('resize', this.updateScreenSize);
    }
}