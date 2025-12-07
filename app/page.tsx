"use client";

import Link from "next/link";
import { Camera, Sparkles, Download, Film, Shield, Zap, Layers, Share2, ArrowRight, Github, User } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

// --- LINKS ---
const PORTFOLIO_LINK = "https://juanamae.vercel.app/"; 
const GITHUB_LINK = "https://github.com/wittyamber/momento"; 

// --- COMPONENTS ---

const AnimatedBackground = () => (
  <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-neutral-950">
     
    <motion.div 
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0], y: [0, 50, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-gradient-to-br from-indigo-600/40 via-purple-500/40 to-fuchsia-600/40 rounded-full blur-[100px] mix-blend-screen"
    />
    
    <motion.div 
      animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], x: [0, -100, 0], y: [0, -50, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-gradient-to-tl from-blue-600/40 via-cyan-500/40 to-teal-400/40 rounded-full blur-[100px] mix-blend-screen"
    />

    <motion.div 
      animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-gradient-to-r from-violet-600/30 to-pink-600/30 rounded-full blur-[120px] mix-blend-screen"
    />

    <div className="absolute inset-0 opacity-25 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

const ParallaxItem = ({ children, offset = 50, className }: { children: React.ReactNode, offset?: number, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [offset, -offset]), { stiffness: 400, damping: 90 });

  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors h-full hover:border-white/20 shadow-xl group">
    <div className="w-14 h-14 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-neutral-400 leading-relaxed">{desc}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-fuchsia-500/30 overflow-hidden">
      
      <AnimatedBackground />

      {/* --- HERO SECTION --- */}
      <section className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <ParallaxItem offset={-40} className="text-center max-w-4xl z-10">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-fuchsia-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                    <Sparkles className="w-4 h-4" /> 
                    <span>New: Export to GIF & Video</span>
                </div>

                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent drop-shadow-2xl">
                    Momento.
                </h1>
                
                <p className="text-xl md:text-2xl text-neutral-300 mb-12 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                    The privacy-first web photobooth. <br/>
                    Capture, customize, and keep your memories in retro style.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/booth">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group h-16 px-10 rounded-full bg-white text-black font-bold text-xl flex items-center gap-3 hover:bg-neutral-200 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.5)]"
                        >
                            Open Booth <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                    <Link href="#features">
                        <button className="h-16 px-10 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            How it Works
                        </button>
                    </Link>
                </div>
            </motion.div>
        </ParallaxItem>

        <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-400 text-sm tracking-widest uppercase"
        >
            Scroll to explore
        </motion.div>
      </section>


      {/* --- HOW IT WORKS (PARALLAX) --- */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <ParallaxItem offset={30}>
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Studio Quality. Browser Speed.</h2>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">Everything happens instantly in your browser. No uploads, no lag.</p>
            </div>
        </ParallaxItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ParallaxItem offset={40}>
                <FeatureCard 
                    icon={Camera}
                    title="Instant Capture"
                    desc="Uses your webcam with zero latency. Features a smart countdown and real flash for that authentic mall photobooth feel."
                />
            </ParallaxItem>

            <ParallaxItem offset={-40}>
                <FeatureCard 
                    icon={Layers}
                    title="Retro Templates"
                    desc="Choose from classic vertical strips, polaroid grids, cinema rolls, or Y2K collages. Visualize changes in real-time."
                />
            </ParallaxItem>

            <ParallaxItem offset={40}>
                <FeatureCard 
                    icon={Zap}
                    title="Live Filters & Effects"
                    desc="Apply Noir, Vintage, or Vivid color grades. Add grain, vignette, or blur. Drag, drop, and rotate stickers."
                />
            </ParallaxItem>
        </div>
      </section>


      {/* --- BENTO GRID SHOWCASE --- */}
      <section className="py-32 px-6 bg-black/20 border-y border-white/5 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
                
                <ParallaxItem offset={20} className="md:col-span-2 md:row-span-2">
                    <div className="bg-gradient-to-br from-neutral-900 to-black rounded-[2rem] p-10 border border-white/10 flex flex-col justify-between overflow-hidden relative group h-full shadow-2xl">
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px]" />
                        <div className="relative z-10">
                            <Shield className="w-16 h-16 text-emerald-400 mb-6" />
                            <h3 className="text-4xl font-bold mb-4">Privacy First.</h3>
                            <p className="text-neutral-400 text-lg leading-relaxed">
                                Your photos never leave your device. All image processing happens locally in your browser using HTML5 Canvas. We don't store your data.
                            </p>
                        </div>
                        <div className="relative z-10 mt-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <Shield className="w-4 h-4" /> Client-Side Only
                            </div>
                        </div>
                    </div>
                </ParallaxItem>

                <ParallaxItem offset={-40} className="md:col-span-2">
                    <div className="bg-neutral-900 rounded-[2rem] p-10 border border-white/10 flex items-center justify-between relative overflow-hidden group h-full shadow-xl">
                        <div className="relative z-10 max-w-xs">
                            <Film className="w-12 h-12 text-blue-400 mb-4" />
                            <h3 className="text-3xl font-bold mb-2">Animated GIFs</h3>
                            <p className="text-neutral-400">Turn your burst shots into motion and download as a GIF.</p>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-600/20 to-transparent blur-3xl"></div>
                    </div>
                </ParallaxItem>

                <ParallaxItem offset={-20} className="md:col-span-1">
                    <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/10 flex flex-col justify-center h-full hover:bg-neutral-800 transition-colors shadow-lg">
                        <Download className="w-10 h-10 text-white mb-4" />
                        <h3 className="text-xl font-bold">HD Export</h3>
                        <p className="text-sm text-neutral-500 mt-2">High-res PNG & JPG</p>
                    </div>
                </ParallaxItem>

                <ParallaxItem offset={-60} className="md:col-span-1">
                    <div className="bg-white text-black rounded-[2rem] p-8 flex flex-col justify-center h-full shadow-lg">
                        <Share2 className="w-10 h-10 mb-4" />
                        <h3 className="text-xl font-bold">Social Ready</h3>
                        <p className="text-sm text-neutral-600 mt-2">Optimized for sharing</p>
                    </div>
                </ParallaxItem>

            </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-32 px-6 text-center">
        <ParallaxItem offset={-30}>
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-neutral-900/80 to-black p-16 rounded-[3rem] border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-50"></div>
                
                <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to make memories?</h2>
                <Link href="/booth">
                    <button className="px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
                        Launch Photobooth
                    </button>
                </Link>
            </div>
        </ParallaxItem>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 border-t border-white/10 text-center text-neutral-500 text-sm bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p>© {new Date().getFullYear()} Momento. All rights reserved.</p>
            
            <div className="flex gap-8 items-center">
                <a 
                    href={PORTFOLIO_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <User className="w-4 h-4 group-hover:text-fuchsia-400 transition-colors" /> 
                    <span>Portfolio</span>
                </a>
                
                <a 
                    href={GITHUB_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <Github className="w-4 h-4 group-hover:text-fuchsia-400 transition-colors" /> 
                    <span>Source Code</span>
                </a>
            </div>
        </div>
      </footer>

    </div>
  );
}