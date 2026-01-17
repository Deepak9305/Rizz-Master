
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md' }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12 md:w-16 md:h-16",
    lg: "w-20 h-20 md:w-24 md:h-24"
  };

  const textClasses = {
    sm: "text-2xl",
    md: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-6xl"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mb-2 group`}>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-40 rounded-full animate-pulse group-hover:opacity-60 transition-opacity"></div>
        
        {/* Vector Icon: Crown + Chat Bubble Spark */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
           <defs>
             <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
               <stop stopColor="#f472b6" /> {/* pink-400 */}
               <stop offset="1" stopColor="#fbbf24" /> {/* amber-400 */}
             </linearGradient>
           </defs>
           
           {/* Crown */}
           <path d="M20 70L10 35L35 50L50 15L65 50L90 35L80 70H20Z" fill="url(#logoGradient)" stroke="white" strokeWidth="3" strokeLinejoin="round" />
           
           {/* Spark/Star Overlay */}
           <path d="M50 0L55 30L85 35L55 40L50 70L45 40L15 35L45 30L50 0Z" fill="white" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center', scale: '0.4' }} />
        </svg>
      </div>

      <h1 className={`${textClasses[size]} font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-500 drop-shadow-sm`}>
        RIZZ MASTER
      </h1>
    </div>
  );
};

export default Logo;
