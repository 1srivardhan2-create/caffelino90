import imgImageLogo from '../assets/logo.svg';
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

      {/* Café Login Button - Top Right Corner */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
        <div className="glass-button-wrap">
          <button 
            className="glass-button"
            onClick={() => onSelectMode('partner')}
          >
            <span>Café Login</span>
          </button>
          <div className="glass-button-shadow"></div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center size-full min-h-screen">
        <div className="content-stretch flex items-center justify-center relative size-full">
          <div className="h-[472px] relative shrink-0 w-[672px] max-w-[90vw]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[472px] relative w-full">
              {/* Logo */}
              <div className="absolute h-[80px] left-1/2 -translate-x-1/2 md:left-[202.66px] md:translate-x-0 top-0 w-[266.663px]" data-name="Image (Logo)">
                <img alt="Caffélino Logo" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageLogo} />
              </div>

              {/* Heading */}
              <div className="absolute h-[48px] left-0 top-[128px] w-full px-4 md:px-0 md:w-[672px]" data-name="Heading 1">
                <p className="absolute font-['Advent_Pro:Regular',_sans-serif] font-normal leading-[48px] left-1/2 text-[32px] md:text-[48px] text-center text-neutral-950 top-[-0.8px] translate-x-[-50%] whitespace-nowrap md:whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Welcome to Caffélino
                </p>
              </div>

              {/* Paragraph */}
              <div className="absolute content-stretch flex h-[28px] items-start left-0 top-[200px] w-full px-4 md:px-0 md:w-[672px]" data-name="Paragraph">
                <p className="basis-0 font-['Archivo_Narrow:Regular',_sans-serif] font-normal grow leading-[28px] min-h-px min-w-px relative shrink-0 text-[18px] md:text-[20px] text-center text-neutral-700">Meet with Friends & Family. Split Bills Easily.</p>
              </div>

              {/* Glassmorphic Meet Button */}
              <div className="absolute content-stretch flex items-center justify-center left-1/2 -translate-x-1/2 top-[276px] w-full" data-name="Container" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
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
              <div className="absolute h-[20px] left-0 top-[500px] w-full px-4 md:px-0 md:w-[672px]" data-name="Paragraph">
                <p className="absolute font-['Arial:Regular',_sans-serif] leading-[20px] left-1/2 not-italic text-[14px] text-center text-neutral-950 text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Plan meetups and split bills effortlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}