import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const LOADING_TEXTS = [
  "Igniting the spark...",
  "Reading the stars...",
  "Curating the vibe...",
  "Mixing the chemistry...",
  "Finding the right words..."
];

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Cycle through texts smoothly
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 1200);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1; 
      });
    }, 30);

    // Trigger exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3200);

    // Actually unmount
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  // Generate random particles for the background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    animationDelay: `${Math.random() * 2}s`,
    opacity: Math.random() * 0.3 + 0.1,
    size: Math.random() * 4 + 2,
  }));

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-black to-black" />
      
      {/* 2. Floating Particles (Bokeh) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-20px] bg-rose-500 rounded-full blur-[1px]"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatUp ${p.animationDuration} ease-in-out infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: var(--opacity); }
          80% { opacity: var(--opacity); }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes drawLine {
          0% { stroke-dashoffset: 600; opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>

      {/* 3. Main Content */}
      <div className="relative z-10 text-center p-8 flex flex-col items-center w-full max-w-md">
        
        {/* Heartbeat Line Animation */}
        <div className="mb-6 w-full h-24 flex items-center justify-center">
            <svg viewBox="0 0 300 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(244, 63, 94, 0.6))' }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(244,63,94,0)" />
                        <stop offset="20%" stopColor="#f43f5e" /> {/* Rose-500 */}
                        <stop offset="50%" stopColor="#d946ef" /> {/* Fuchsia-500 */}
                        <stop offset="80%" stopColor="#f43f5e" /> {/* Rose-500 */}
                        <stop offset="100%" stopColor="rgba(244,63,94,0)" />
                    </linearGradient>
                </defs>
                <path 
                    d="M0 50 L120 50 L135 10 L150 90 L165 50 L300 50"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        strokeDasharray: '400',
                        strokeDashoffset: '400',
                        animation: 'drawLine 2.2s ease-in-out infinite'
                    }}
                />
            </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-sm">
          RIZZ MASTER
        </h1>
        
        <div className="h-6 mb-10 overflow-hidden relative">
           <p className="text-rose-200/50 text-sm font-medium tracking-widest uppercase transition-all duration-500 transform">
            {LOADING_TEXTS[textIndex]}
          </p>
        </div>

        {/* Minimalist Loading Bar */}
        <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-rose-500 to-transparent transition-all ease-linear"
            style={{ 
              width: '100%', 
              transform: `translateX(${progress - 100}%)`,
              transitionDuration: '50ms'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
