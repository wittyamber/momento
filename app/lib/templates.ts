// lib/templates.ts

export type TemplateId = "strip" | "grid" | "film" | "collage";

export interface Template {
  id: TemplateId;
  name: string;
  icon: string;
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, images: HTMLImageElement[]) => void;
}

export const TEMPLATES: Template[] = [
  {
    id: "strip",
    name: "Classic",
    icon: "🎞️",
    width: 680,
    height: 2400,
    draw: (ctx, images) => {
      // Dark Background
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, 680, 2400);
      
      const photoW = 600;
      const photoH = 450;
      const gap = 30;
      const padding = 40;

      images.forEach((img, i) => {
        const y = padding + (i * (photoH + gap));
        // White Border
        ctx.fillStyle = "white";
        ctx.fillRect(padding - 10, y - 10, photoW + 20, photoH + 20);
        ctx.drawImage(img, padding, y, photoW, photoH);
      });

      // Footer
      ctx.fillStyle = "white";
      ctx.font = "bold 60px Courier New";
      ctx.textAlign = "center";
      ctx.fillText("MOMENTO.", 340, 2250);
      ctx.font = "30px Courier New";
      ctx.fillStyle = "#888";
      ctx.fillText(new Date().toLocaleDateString(), 340, 2300);
    }
  },
  {
    id: "grid",
    name: "Polaroid",
    icon: "▦",
    width: 1300,
    height: 1600,
    draw: (ctx, images) => {
      // White Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1300, 1600);
      
      // Texture (Subtle Noise)
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      for(let i=0; i<1000; i++) {
        ctx.fillRect(Math.random()*1300, Math.random()*1600, 2, 2);
      }

      const photoW = 580;
      const photoH = 435;
      const padding = 60;
      const gap = 20;

      images.forEach((img, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        
        const x = padding + (col * (photoW + gap));
        // FIX: Used 'photoH' here instead of 'photoHeight'
        const y = padding + (row * (photoH + gap)); 
        
        ctx.drawImage(img, x, y, photoW, photoH);
      });

      // Handwritten Footer
      ctx.fillStyle = "#222";
      ctx.font = "italic bold 80px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Momento", 650, 1400);
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText(new Date().toLocaleDateString(), 650, 1480);
    }
  },
  {
    id: "film",
    name: "Cinema",
    icon: "🎬",
    width: 800,
    height: 2400,
    draw: (ctx, images) => {
      // Black Film Strip Background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 800, 2400);
      
      // Draw Sprocket Holes
      ctx.fillStyle = "#ffffff";
      for (let y = 50; y < 2400; y += 120) {
        ctx.fillRect(30, y, 50, 80); // Left holes
        ctx.fillRect(720, y, 50, 80); // Right holes
      }

      const photoW = 560;
      const photoH = 420;
      const startY = 100;
      const gap = 150;

      images.forEach((img, i) => {
        const y = startY + (i * (photoH + gap));
        ctx.drawImage(img, 120, y, photoW, photoH);
      });
      
      // Red Date Stamp
      ctx.fillStyle = "#ff5555";
      ctx.font = "40px monospace";
      ctx.textAlign = "right";
      ctx.shadowColor = "red";
      ctx.shadowBlur = 10;
      ctx.fillText(new Date().toLocaleDateString(), 650, 2300);
    }
  },
  {
    id: "collage",
    name: "Y2K",
    icon: "✨",
    width: 1200,
    height: 1800,
    draw: (ctx, images) => {
      // Hot Pink Gradient Background
      const grad = ctx.createLinearGradient(0,0, 1200, 1800);
      grad.addColorStop(0, "#ff00cc");
      grad.addColorStop(1, "#333399");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 1800);

      // Random placement
      const positions = [
        { x: 50, y: 50, rot: -0.1 },
        { x: 600, y: 100, rot: 0.1 },
        { x: 100, y: 600, rot: 0.05 },
        { x: 650, y: 650, rot: -0.05 }
      ];

      images.forEach((img, i) => {
        const pos = positions[i];
        ctx.save();
        ctx.translate(pos.x + 250, pos.y + 200);
        ctx.rotate(pos.rot);
        
        // White Border with Shadow
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "white";
        ctx.fillRect(-260, -210, 520, 420);
        
        ctx.shadowBlur = 0;
        ctx.drawImage(img, -250, -200, 500, 400);
        ctx.restore();
      });

      // Overlay Text
      ctx.fillStyle = "white";
      ctx.font = "bold 120px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("XOXO", 600, 1600);
    }
  }
];