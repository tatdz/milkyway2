import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function Logo({ className, size = "md", showIcon = true }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-4xl"
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {showIcon && (
        <div className="relative">
          {/* Galaxy/Milky Way Icon */}
          <svg 
            className={cn(
              "text-indigo-400", 
              size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-12 h-12"
            )}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Spiral galaxy shape */}
            <path 
              d="M12 2C17.523 2 22 6.477 22 12s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" 
              fill="url(#galaxy-gradient)"
              opacity="0.3"
            />
            <path 
              d="M12 4c1.5 0 3 .5 4.5 1.5s3 2.5 3.5 4.5c.5 2-1 4-3 4.5s-4 .5-6 0-4-1.5-5-3.5S6 7 8 6s3.5-1.5 4-2z" 
              fill="currentColor"
              opacity="0.6"
            />
            <path 
              d="M12 6c1 0 2 .3 3 1s2 1.7 2.3 3c.3 1.3-.7 2.7-2 3s-2.7.3-4 0-2.7-1-3.3-2.3S8.3 8 9.3 7.7s2.3-1 2.7-1.7z" 
              fill="currentColor"
              opacity="0.8"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            
            {/* Stars */}
            <circle cx="8" cy="8" r="0.5" fill="#fbbf24" opacity="0.8" />
            <circle cx="16" cy="9" r="0.3" fill="#f3f4f6" opacity="0.6" />
            <circle cx="7" cy="15" r="0.4" fill="#34d399" opacity="0.7" />
            <circle cx="17" cy="16" r="0.3" fill="#60a5fa" opacity="0.5" />
            <circle cx="9" cy="5" r="0.2" fill="#fde047" opacity="0.4" />
            <circle cx="19" cy="13" r="0.2" fill="#e879f9" opacity="0.6" />
            
            <defs>
              <radialGradient id="galaxy-gradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </radialGradient>
            </defs>
          </svg>
          
          {/* Orbiting dot animation */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div 
              className={cn(
                "absolute bg-yellow-300 rounded-full",
                size === "sm" ? "w-1 h-1 -top-0.5 left-1/2" : 
                size === "md" ? "w-1.5 h-1.5 -top-1 left-1/2" : 
                "w-2 h-2 -top-1 left-1/2"
              )}
              style={{ transform: 'translateX(-50%)' }}
            />
          </div>
        </div>
      )}
      
      <div className="flex flex-col">
        <h1 
          className={cn(
            "font-normal tracking-tight text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text",
            sizes[size]
          )}
          style={{ fontFamily: "'Silkscreen', monospace" }}
        >
          Milkyway2
        </h1>
        {size !== "sm" && (
          <p className="text-xs text-slate-400 font-mono">
            Decentralized Risk Assessment
          </p>
        )}
      </div>
    </div>
  );
}