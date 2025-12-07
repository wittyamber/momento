"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCamera } from "@/app/hooks/useCamera";
import { Home, Download, RotateCcw, Wand2, Smile, Sparkles, Film, Maximize2, RotateCw, Trash2, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { TEMPLATES, Template } from "@/app/lib/templates";
import { generateGif } from "@/app/lib/gif";

// --- CONFIGURATION ---
const FILTERS = [
  { id: "normal", name: "Normal", css: "brightness-100", ctxFilter: "none" },
  { id: "noir", name: "Noir", css: "grayscale(100%) contrast(120%)", ctxFilter: "grayscale(100%) contrast(120%)" },
  { id: "vintage", name: "Sepia", css: "sepia(80%) contrast(90%)", ctxFilter: "sepia(80%) contrast(90%)" },
  { id: "1977", name: "1977", css: "sepia(50%) hue-rotate(-30deg) saturate(140%)", ctxFilter: "sepia(50%) hue-rotate(-30deg) saturate(140%)" },
  { id: "cyber", name: "Cyber", css: "saturate(200%) contrast(120%) hue-rotate(180deg)", ctxFilter: "saturate(200%) contrast(120%) hue-rotate(180deg)" },
  { id: "dramatic", name: "Drama", css: "contrast(150%) brightness(90%) grayscale(40%)", ctxFilter: "contrast(150%) brightness(90%) grayscale(40%)" },
  { id: "golden", name: "Golden", css: "brightness(110%) saturate(140%) sepia(30%)", ctxFilter: "brightness(110%) saturate(140%) sepia(30%)" },
];

const EFFECTS = [
  { id: "none", name: "None", css: "none" },
  { id: "vignette", name: "Vignette", css: "radial-gradient(circle, transparent 50%, black 100%)" },
  { id: "grain", name: "Grain", css: "url('https://grainy-gradients.vercel.app/noise.svg')" },
  { id: "leak", name: "Leak", css: "linear-gradient(45deg, rgba(255,0,0,0.2) 0%, transparent 70%)" },
  { id: "rainbow", name: "Prism", css: "linear-gradient(90deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1))" },
  { id: "blur", name: "Soft", css: "blur" },
];

const STICKER_LIST = [
  "✌️", "❤️", "🔥", "✨", "😎", "🎀", "👑", "🐶", 
  "💀", "👽", "🦋", "🌸", "🍕", "🥂", "📸", "🌈", "⚡️", "💯", "🎉", "💩", "👻", "👀"
];

// --- TYPES ---
type StickerInstance = {
    id: number;
    content: string;
    x: number; 
    y: number; 
    scale: number;
    rotation: number;
};

export default function BoothPage() {
  const { videoRef, stream, permissionDenied } = useCamera();
  const containerRef = useRef<HTMLDivElement>(null);

  // --- STATE ---
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Customization
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [activeEffect, setActiveEffect] = useState(EFFECTS[0]);
  const [activeTab, setActiveTab] = useState<"filters" | "effects" | "stickers">("filters");
  
  // Multiple Stickers
  const [placedStickers, setPlacedStickers] = useState<StickerInstance[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);

  // Templates & Result View
  const [activeTemplate, setActiveTemplate] = useState<Template>(TEMPLATES[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [gifPreviewUrl, setGifPreviewUrl] = useState<string | null>(null); 
  const [resultTab, setResultTab] = useState<"strip" | "gif">("strip");

  const TOTAL_PHOTOS = 4;

  useEffect(() => {
    if (!isFinished && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isFinished, stream]);

  // --- STICKER HELPERS ---
  const addSticker = (content: string) => {
    const newSticker: StickerInstance = {
        id: Date.now(),
        content,
        x: 0.5, y: 0.5, scale: 1, rotation: 0
    };
    setPlacedStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const updateSticker = (id: number, updates: Partial<StickerInstance>) => {
    setPlacedStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSticker = (id: number) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
    setSelectedStickerId(null);
  };

  // --- CAPTURE LOGIC ---
  const capturePhoto = () => {
    if (videoRef.current && containerRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw Video
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.filter = activeFilter.ctxFilter;
        ctx.drawImage(videoRef.current, 0, 0);
        ctx.filter = "none"; 
        ctx.setTransform(1, 0, 0, 1, 0, 0); 

        // Draw Effects
        if (activeEffect.css.includes("gradient")) {
            ctx.fillStyle = activeEffect.css.replace("linear-gradient", "-webkit-linear-gradient"); 
            if(activeEffect.id === "vignette") {
                const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height/3, canvas.width/2, canvas.height/2, canvas.height);
                g.addColorStop(0, "transparent");
                g.addColorStop(1, "rgba(0,0,0,0.8)");
                ctx.fillStyle = g;
                ctx.fillRect(0,0, canvas.width, canvas.height);
            }
        }

        // Draw Stickers
        placedStickers.forEach(sticker => {
             const fontSize = canvas.width * 0.15 * sticker.scale;
             const x = (1 - sticker.x) * canvas.width;
             const y = sticker.y * canvas.height;
             ctx.save();
             ctx.translate(x, y);
             ctx.rotate((sticker.rotation * Math.PI) / 180); 
             ctx.font = `${fontSize}px serif`; 
             ctx.textAlign = "center";
             ctx.textBaseline = "middle";
             ctx.fillText(sticker.content, 0, 0);
             ctx.restore();
        });
        
        const photoData = canvas.toDataURL("image/jpeg", 0.9);
        setPhotos((prev) => [...prev, photoData]);
      }
    }
  };

  // --- PREVIEW GENERATORS ---
  useEffect(() => {
    if (photos.length === 0 || !isFinished) return;

    const generateStrip = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = activeTemplate.width;
        canvas.height = activeTemplate.height;
        const ctx = canvas.getContext("2d");
        if(!ctx) return;
        const loadedImages = await Promise.all(photos.map(src => new Promise<HTMLImageElement>((resolve) => {
            const img = new Image(); img.onload = () => resolve(img); img.src = src;
        })));
        activeTemplate.draw(ctx, loadedImages);
        setPreviewUrl(canvas.toDataURL("image/jpeg", 0.7)); 
    };

    const generateGifPreview = async () => {
        const gifBlob = await generateGif(photos);
        const url = URL.createObjectURL(gifBlob);
        setGifPreviewUrl(url);
    };

    generateStrip();
    generateGifPreview();
  }, [isFinished, activeTemplate, photos]);

  // --- TIMER ---
  useEffect(() => {
    if (!isSessionActive) return;
    if (photos.length >= TOTAL_PHOTOS) {
      setIsSessionActive(false);
      setIsFinished(true);
      return;
    }
    let count = 3;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        setFlash(true);
        capturePhoto();
        setCountdown(null);
        setTimeout(() => setFlash(false), 150);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSessionActive, photos.length]);

  const startSession = () => {
    setPhotos([]);
    setPreviewUrl(null);
    setGifPreviewUrl(null);
    setIsFinished(false);
    setIsSessionActive(true);
    setSelectedStickerId(null);
    setResultTab("strip"); 
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    if (resultTab === "strip" && previewUrl) {
        a.href = previewUrl;
        a.download = `momento-${activeTemplate.id}-${Date.now()}.jpg`;
        a.click();
    } else if (resultTab === "gif" && gifPreviewUrl) {
        a.href = gifPreviewUrl;
        a.download = `momento-anim-${Date.now()}.gif`;
        a.click();
    }
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center relative p-4 overflow-x-hidden touch-manipulation">
      
      <AnimatePresence>
        {flash && <motion.div exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white pointer-events-none" />}
      </AnimatePresence>

      {/* --- HOME BUTTON FIXED --- */}
      <div className="absolute top-4 left-4 z-[60] flex gap-4">
        <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium hover:bg-white/10 transition-colors border border-white/10"
        >
            <Home className="w-3 h-3" /> Home
        </Link>
      </div>

      {/* --- CAMERA STAGE --- */}
      {!permissionDenied && !isFinished && (
        <div 
            ref={containerRef} 
            className="relative w-full md:max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-neutral-800 bg-neutral-900 mb-4 mt-10"
            onClick={() => setSelectedStickerId(null)}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ filter: activeFilter.css }}
            className="w-full h-full object-cover transform scale-x-[-1]" 
          />

          {/* Effects */}
          {activeEffect.id !== "none" && (
             <div 
                className="absolute inset-0 pointer-events-none z-10"
                style={{ 
                    backgroundImage: (activeEffect.id !== "blur") ? activeEffect.css : undefined,
                    backdropFilter: activeEffect.id === "blur" ? "blur(4px)" : undefined,
                    opacity: 0.5,
                    mixBlendMode: activeEffect.id === "leak" ? "screen" : "normal"
                }}
             />
          )}

          {/* Stickers */}
          {placedStickers.map((sticker) => (
            <motion.div
                key={sticker.id}
                drag dragConstraints={containerRef} dragMomentum={false} 
                onDragEnd={(_, info) => {
                    if(containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        const x = (info.point.x - rect.left) / rect.width;
                        const y = (info.point.y - rect.top) / rect.height;
                        updateSticker(sticker.id, { x, y });
                    }
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedStickerId(sticker.id); }}
                style={{ 
                    left: `${sticker.x * 100}%`, top: `${sticker.y * 100}%`,
                    scale: sticker.scale, rotate: sticker.rotation,
                    translateX: "-50%", translateY: "-50%"
                }}
                className={cn(
                    "absolute text-6xl z-30 select-none touch-none cursor-grab active:cursor-grabbing origin-center",
                    selectedStickerId === sticker.id ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] filter brightness-125" : ""
                )}
            >
                {sticker.content}
            </motion.div>
          ))}

          <AnimatePresence>
            {countdown !== null && (
              <motion.div 
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
              >
                <span className="text-8xl md:text-9xl font-bold text-white drop-shadow-2xl font-mono">{countdown}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* --- CONTROLS --- */}
      {!isSessionActive && !isFinished && !permissionDenied && (
        <div className="w-full md:max-w-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
            
            {/* Sticker Tools */}
            {selectedStickerId !== null && (
                <div className="flex flex-col items-center gap-2 mb-4 bg-neutral-900/90 p-3 rounded-2xl border border-white/10 backdrop-blur-md w-max mx-auto animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2">
                            <Maximize2 className="w-3 h-3 text-neutral-400" />
                            <input type="range" min="0.5" max="3" step="0.1"
                                value={placedStickers.find(s => s.id === selectedStickerId)?.scale || 1}
                                onChange={(e) => updateSticker(selectedStickerId, { scale: parseFloat(e.target.value) })}
                                className="w-20 accent-white h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <RotateCw className="w-3 h-3 text-neutral-400" />
                            <input type="range" min="-180" max="180" step="5"
                                value={placedStickers.find(s => s.id === selectedStickerId)?.rotation || 0}
                                onChange={(e) => updateSticker(selectedStickerId, { rotation: parseFloat(e.target.value) })}
                                className="w-20 accent-white h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                         <button onClick={() => deleteSticker(selectedStickerId)} className="bg-red-500/20 p-1.5 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Tabs */}
            <div className="flex justify-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: "filters", icon: Wand2, label: "Filters" },
                    { id: "effects", icon: Sparkles, label: "Effects" },
                    { id: "stickers", icon: Smile, label: "Stickers" }
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap", activeTab === tab.id ? "bg-white text-black" : "bg-neutral-800 text-neutral-400")}
                    >
                        <tab.icon className="w-3 h-3" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Selection Grid */}
            <div className="bg-neutral-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex gap-3 min-w-max px-2">
                    {activeTab === "filters" && FILTERS.map((f) => (
                        <button key={f.id} onClick={() => setActiveFilter(f)} className={cn("flex flex-col items-center gap-2 p-1.5 rounded-xl transition-all border-2", activeFilter.id === f.id ? "border-white bg-white/10" : "border-transparent opacity-60")}>
                            <div className={cn("w-10 h-10 rounded-full bg-neutral-800", f.id==="normal" ? "bg-gradient-to-br from-pink-500 to-orange-400" : "")} style={{ filter: f.css }}></div>
                            <span className="text-[10px] uppercase font-bold tracking-wider">{f.name}</span>
                        </button>
                    ))}
                    {activeTab === "effects" && EFFECTS.map((e) => (
                         <button key={e.id} onClick={() => setActiveEffect(e)} className={cn("flex flex-col items-center gap-2 p-1.5 rounded-xl transition-all border-2", activeEffect.id === e.id ? "border-white bg-white/10" : "border-transparent opacity-60")}>
                            <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 overflow-hidden relative">
                                <div className="absolute inset-0" style={{ backgroundImage: (e.id !== "blur") ? e.css : undefined, backdropFilter: e.id==="blur" ? "blur(4px)" : undefined }}></div>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider">{e.name}</span>
                        </button>
                    ))}
                    {activeTab === "stickers" && STICKER_LIST.map((s) => (
                         <button key={s} onClick={() => addSticker(s)} className={cn("w-12 h-12 flex items-center justify-center text-2xl rounded-xl border-2 border-transparent hover:bg-white/5 transition-all active:scale-95")}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <button onClick={startSession} className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-neutral-300 shadow-xl hover:scale-105 transition-all active:scale-95">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full border-2 border-black/10 group-hover:bg-red-600 transition-colors"></div>
                </button>
            </div>
        </div>
      )}

      {/* --- REVIEW SCREEN --- */}
      {isFinished && (
        <div className="w-full md:max-w-lg flex flex-col items-center animate-in zoom-in duration-300 pb-10 mt-10">
            
            {/* VIEW TOGGLE */}
            <div className="flex bg-neutral-900 p-1 rounded-full mb-6 border border-white/10">
                <button 
                    onClick={() => setResultTab("strip")}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2", resultTab === "strip" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white")}
                >
                   <LayoutTemplate className="w-3 h-3" /> Photo Strip
                </button>
                <button 
                    onClick={() => setResultTab("gif")}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2", resultTab === "gif" ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-white")}
                >
                   <Film className="w-3 h-3" /> Animated GIF
                </button>
            </div>
            
            {/* TEMPLATES */}
            {resultTab === "strip" && (
                <div className="flex gap-3 mb-6 w-full overflow-x-auto px-4 pb-2 justify-start md:justify-center scrollbar-hide">
                    {TEMPLATES.map((t) => (
                        <button key={t.id} onClick={() => setActiveTemplate(t)} className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[80px]", activeTemplate.id === t.id ? "border-white bg-white/10" : "border-neutral-800 hover:bg-neutral-900")}>
                            <span className="text-2xl">{t.icon}</span>
                            <span className="text-[10px] uppercase font-bold">{t.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* PREVIEW AREA */}
            <div className="relative mb-6 shadow-2xl rounded-sm overflow-hidden min-h-[300px] flex items-center justify-center">
                {resultTab === "strip" ? (
                     previewUrl ? (
                        <img src={previewUrl} alt="Strip" className="max-h-[50vh] w-auto object-contain border-4 border-white" />
                     ) : <div className="text-neutral-500">Generating Strip...</div>
                ) : (
                    gifPreviewUrl ? (
                        <img src={gifPreviewUrl} alt="GIF" className="max-h-[50vh] w-auto object-contain border-4 border-white" />
                    ) : <div className="text-neutral-500 flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" /> Generating GIF...</div>
                )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 w-full px-4 max-w-sm">
                <button onClick={startSession} className="col-span-1 py-3 bg-neutral-800 rounded-full flex items-center justify-center gap-2 hover:bg-neutral-700 transition text-sm">
                    <RotateCcw className="w-4 h-4" /> Retake
                </button>
                <button onClick={handleDownload} className="col-span-1 py-3 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 hover:bg-neutral-200 transition text-sm">
                    <Download className="w-4 h-4" /> Save {resultTab === "strip" ? "Photo" : "GIF"}
                </button>
            </div>
        </div>
      )}
    </main>
  );
}