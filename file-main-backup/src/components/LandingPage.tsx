const CAFFELINO_LOGO_URL = 'https://i.postimg.cc/g0S6yjSj/caffelino-removebg-preview.png';
const imgOner1 = "/oner1.png";
import { ArrowLeft } from "lucide-react";

interface LandingPageProps {
  onSelectMode: (mode: 'go' | 'partner') => void;
  onBack?: () => void;
}

export default function LandingPage({ onSelectMode, onBack }: LandingPageProps) {
  return (
    <div className="glass-button-root relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full min-h-screen" data-name="LandingPage" style={{ backgroundImage: "linear-gradient(147.955deg, rgb(100, 65, 48) 2%, rgb(217, 191, 157) 52.404%, rgb(139, 89, 67) 100%), linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%)" }}>
      {/* Dotted Grid Background Pattern */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dottedGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dottedGrid)" />
      </svg>

      {/* Back Button - Top Left Corner */}
      {onBack && (
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black transition-all hover:scale-105"
            style={{ 
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)"
            }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Back</span>
          </button>
        </div>
      )}


      <div className="flex items-center justify-center size-full min-h-screen px-4">
        <div className="flex flex-col items-center justify-center w-full max-w-[672px] z-[1]" data-name="Container">
          {/* Logo - Centered & Prominent */}
          <div className="mb-6 md:mb-8" data-name="Image (Logo)">
            <img alt="Caffelino Logo" className="w-[140px] md:w-[180px] h-auto object-contain pointer-events-none drop-shadow-lg" src={CAFFELINO_LOGO_URL} />
          </div>

          {/* Heading */}
          <h1 className="font-['Advent_Pro:Regular',_sans-serif] font-normal text-[32px] md:text-[48px] text-center text-neutral-950 leading-tight mb-3 md:mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
            Welcome to Caffélino
          </h1>

          {/* Subtitle */}
          <p className="font-['Archivo_Narrow:Regular',_sans-serif] font-normal text-[18px] md:text-[20px] text-center text-neutral-700 leading-[28px] mb-10 md:mb-12">
            Meet with Friends & Family. Split Bills Easily.
          </p>

          {/* Glassmorphic Meet Button */}
          <div className="mb-10 md:mb-14" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            <div className="glass-button-wrap">
              <button 
                className="glass-button px-12 py-4"
                onClick={() => onSelectMode('go')}
              >
                <span>Let's Go</span>
              </button>
              <div className="glass-button-shadow"></div>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-center text-neutral-950 leading-[20px]">
            Plan meetups and split bills effortlessly
          </p>
        </div>
      </div>
    </div>
  );
}