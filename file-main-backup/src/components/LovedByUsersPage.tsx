import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ArrowLeft } from "lucide-react";
import { BASE_URL } from "../utils/api";
import socketService from "../services/socketService";

interface LovedByUsersPageProps {
  onNavigate: (page: string) => void;
  user: any;
}

interface Review {
  _id?: string;
  userId: string;
  userName: string;
  userProfile: string;
  stars: number;
  feedback: string;
  createdAt?: string | Date;
  initialX: number;
  initialY: number;
}

const FloatingCoffeeBeans = () => (
  <>
    {[...Array(25)].map((_, i) => {
      const size = 16 + Math.random() * 24; // 16px to 40px
      const duration = 12 + Math.random() * 18; // 12s to 30s
      const delay = Math.random() * -20; // negative delay so they are already scattered at load
      const startX = Math.random() * 100; // in vw
      const startY = Math.random() * 100; // in vh
      
      return (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-[#A0826D] opacity-55"
          style={{
            width: size,
            height: size,
            left: `${startX}vw`,
            top: `${startY}vh`,
          }}
          animate={{
            x: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
            y: [0, Math.random() * -150 - 50, Math.random() * 150 + 50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <svg viewBox="0 0 32 32" className="w-full h-full fill-current filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            <ellipse cx="16" cy="16" rx="9" ry="14" transform="rotate(-30 16 16)" />
            <path 
              d="M 12 6 C 13 12, 19 20, 20 26" 
              stroke="#3D2817" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
          </svg>
        </motion.div>
      );
    })}
  </>
);

const FloatingParticles = () => (
  <>
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#E8D7C6] to-[#D4A574] opacity-40 shadow-[0_0_8px_rgba(232,215,198,0.5)]"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        animate={{
          y: [null, -100 + Math.random() * -100, null],
          x: [null, Math.random() * 50 - 25, null],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8 + Math.random() * 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </>
);

const SteamAnimation = ({ className }: { className?: string }) => (
  <div className={`absolute ${className}`}>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-16 h-16 rounded-full bg-white/5 blur-xl"
        initial={{ y: 0, opacity: 0.3, scale: 0.5 }}
        animate={{
          y: -150,
          opacity: 0,
          scale: 1.5,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

const FloatingReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const duration = 22 + Math.random() * 18;
  const xRange = 60 + Math.random() * 110;
  const yRange = 40 + Math.random() * 70;

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: review.initialX,
        top: review.initialY,
      }}
      animate={{
        y: [0, -yRange, yRange, 0],
        x: [0, xRange, -xRange / 2, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.4,
      }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
    >
      <div
        className="rounded-3xl p-6 min-w-[300px] max-w-[350px]"
        style={{
          background: 'linear-gradient(135deg, rgba(107, 93, 69, 0.55), rgba(92, 61, 46, 0.45), rgba(61, 40, 23, 0.4))',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 25px 70px rgba(91, 54, 23, 0.6)',
          border: '1px solid rgba(212, 165, 116, 0.25)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {review.userProfile ? (
            <img 
              src={review.userProfile} 
              alt={review.userName} 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#D4A574]/60 shadow-[0_0_15px_rgba(212,165,116,0.35)]"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 border-[#D4A574]/40"
              style={{
                background: 'linear-gradient(135deg, #A0826D, #6B4423)',
                boxShadow: '0 8px 20px rgba(107, 68, 35, 0.5)',
              }}
            >
              {review.userName[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-sm text-[#E8D7C6]">{review.userName}</h4>
            <div className="flex gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 transition-all ${
                    i < review.stars ? "fill-yellow-300 text-yellow-300" : ""
                  }`}
                  style={{
                    filter: i < review.stars
                      ? 'drop-shadow(0 0 8px rgba(253, 224, 71, 0.7))'
                      : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.05))',
                    color: i < review.stars ? undefined : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(215, 204, 200, 0.9)' }}>{review.feedback}</p>
      </div>
    </motion.div>
  );
};

export default function LovedByUsersPage({ onNavigate, user }: LovedByUsersPageProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/reviews`);
      if (response.ok) {
        const data = await response.json();
        // Map fetched database reviews with randomized coordinate offsets for animation
        const animatedReviews = data.map((rev: any) => ({
          ...rev,
          initialX: Math.random() * (window.innerWidth - 400) + 50,
          initialY: Math.random() * (window.innerHeight - 300) + 100,
        }));
        setReviews(animatedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();

    // Establish Socket.io connection for real-time review updates!
    const socket = socketService.connect();
    if (socket) {
      socket.on("new_global_review", (savedReview: any) => {
        setReviews((prevReviews) => {
          if (prevReviews.some((r) => r._id === savedReview._id)) {
            return prevReviews;
          }
          const newReview: Review = {
            ...savedReview,
            initialX: Math.random() * (window.innerWidth - 400) + 50,
            initialY: Math.random() * (window.innerHeight - 300) + 100,
          };
          return [newReview, ...prevReviews];
        });
      });
    }

    return () => {
      const socket = socketService.socket;
      if (socket) {
        socket.off("new_global_review");
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (rating > 0 && feedback.trim() && user) {
      try {
        const response = await fetch(`${BASE_URL}/api/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            userProfile: user.photo || "",
            stars: rating,
            feedback: feedback.trim(),
          }),
        });

        if (response.ok) {
          const savedReview = await response.json();
          const newReview: Review = {
            ...savedReview,
            initialX: Math.random() * (window.innerWidth - 400) + 50,
            initialY: Math.random() * (window.innerHeight - 300) + 100,
          };
          setReviews((prevReviews) => [newReview, ...prevReviews]);
          setRating(0);
          setFeedback("");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#26140A]">
      <style>{`
        @keyframes glitterShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .glitter-gold-black {
          background: linear-gradient(
            90deg,
            #000000 0%,
            #4a3718 10%,
            #b8860b 25%,
            #ffd700 40%,
            #fff8d6 50%,
            #ffd700 60%,
            #b8860b 75%,
            #000000 90%,
            #d4af37 95%,
            #000000 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: glitterShimmer 6s linear infinite;
          text-shadow: 0 0 2px rgba(255, 215, 0, 0.3);
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.25)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9));
        }
      `}</style>

      {/* Background Effects */}
      <FloatingCoffeeBeans />
      <FloatingParticles />
      <SteamAnimation className="top-20 left-1/4" />
      <SteamAnimation className="top-40 right-1/3" />

      {/* Blur Circles - Luxury Glow */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#A0826D] to-[#8B6F47] opacity-40 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-[#6B4423] to-[#5C3D2E] opacity-50 rounded-full blur-[120px]" />

      {/* Back Button */}
      <motion.button
        onClick={() => onNavigate('home')}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-6 py-3 rounded-full text-white transition-all duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
        whileHover={{ 
          scale: 1.05, 
          y: -2,
          background: '#000000',
          borderColor: 'rgba(212, 165, 116, 0.4)',
          boxShadow: '0 12px 32px rgba(212, 165, 116, 0.25), 0 0 15px rgba(212, 165, 116, 0.15)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Floating Reviews */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
        <AnimatePresence>
          {reviews.map((review, index) => (
            <FloatingReviewCard key={review.id} review={review} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-start min-h-screen px-4 py-20" style={{ zIndex: 10 }}>
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15), rgba(0, 0, 0, 0.6))', filter: 'blur(48px)' }} />
            <h1 className="relative text-6xl md:text-7xl font-extrabold mb-4 glitter-gold-black py-2">
              Loved by Real People
            </h1>
          </div>
        </motion.div>

        {/* Main Glass Card */}
        <motion.div
          className="w-[92%] max-w-[460px] rounded-[28px] p-5 md:p-6 mb-8 mt-4"
          style={{
            background: 'linear-gradient(135deg, rgba(62, 39, 35, 0.7), rgba(93, 64, 55, 0.6), rgba(61, 40, 23, 0.65))',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(212, 165, 116, 0.15)',
            border: '1px solid rgba(212, 165, 116, 0.25)',
          }}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [10, -5, 10]
          }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.2 },
            scale: { duration: 0.8, delay: 0.2 },
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }
          }}
          whileHover={{ boxShadow: "0 40px 120px rgba(212, 165, 116, 0.2), inset 0 1px 0 rgba(212, 165, 116, 0.3)" }}
        >
          <div className="flex flex-col items-center gap-4 w-full">
            {/* 1. FEEDBACK TEXTAREA (TOP) */}
            <div className="w-full relative">
              <style>{`
                .loved-textarea::placeholder { color: #d7ccc8 !important; opacity: 0.65; }
                .loved-textarea:focus { 
                  box-shadow: 0 0 20px rgba(255, 213, 79, 0.4) !important; 
                  border-color: #FFD54F !important;
                }
              `}</style>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your café experience..."
                rows={3}
                className="loved-textarea w-full h-24 rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.2)] p-4 text-white outline-none focus:ring-2 focus:ring-[#FFD54F] transition-all text-sm resize-none"
              />
            </div>

            {/* 2. STAR RATING SECTION (CENTER) */}
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-lg font-semibold text-[#f5e6d3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                How was your experience?
              </h2>

              <div className="flex justify-center gap-2.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    whileTap={{ scale: 0.85 }}
                    className="relative group"
                  >
                    <Star
                      className="w-9 h-9 transition-all duration-300"
                      style={{
                        fill: star <= (hoverRating || rating) ? '#facc15' : 'none',
                        color: star <= (hoverRating || rating) ? '#facc15' : 'rgba(255, 255, 255, 0.25)',
                        filter: star <= (hoverRating || rating)
                          ? 'drop-shadow(0 0 15px rgba(255, 213, 79, 0.9))'
                          : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.1))',
                      }}
                    />
                    {star <= (hoverRating || rating) && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #FFD54F, #facc15)',
                          filter: 'blur(15px)',
                          opacity: 0.6,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.8, opacity: 0.6 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 3. SUBMIT BUTTON (BOTTOM) */}
            <motion.button
              onClick={user ? handleSubmit : () => onNavigate('home')}
              disabled={user && (!rating || !feedback.trim())}
              className="px-8 py-2.5 w-full sm:w-auto rounded-full text-white text-base font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
              }}
              whileHover={user ? { 
                scale: 1.04, 
                y: -1.5,
                boxShadow: "0 10px 30px rgba(255, 213, 79, 0.25)",
                borderColor: 'rgba(255, 213, 79, 0.45)'
              } : {}}
              whileTap={user ? { scale: 0.97 } : {}}
            >
              {user ? "Share Experience ☕" : "Login to Share ☕"}
            </motion.button>
          </div>
        </motion.div>

        {/* Community Section */}
        {reviews.length > 0 && (
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2
              className="text-4xl font-bold mb-8"
              style={{
                background: 'linear-gradient(90deg, #E8D7C6, #D4A574)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 8px rgba(212, 165, 116, 0.3))',
              }}
            >
              Top Community Moments ❤️
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
              {reviews.slice(0, 3).map((review) => (
                <motion.div
                  key={review._id}
                  className="rounded-3xl p-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(107, 93, 69, 0.55), rgba(92, 61, 46, 0.45))',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    boxShadow: '0 25px 70px rgba(91, 54, 23, 0.6)',
                    border: '1px solid rgba(212, 165, 116, 0.25)',
                  }}
                  whileHover={{ scale: 1.08, y: -6, boxShadow: "0 35px 100px rgba(212, 165, 116, 0.4)" }}
                >
                  <div className="flex gap-2 mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                        <Star
                          className={`w-5 h-5 ${i < review.stars ? "fill-yellow-300 text-yellow-300" : ""}`}
                          style={{
                            filter: i < review.stars
                              ? 'drop-shadow(0 0 12px rgba(253, 224, 71, 0.8))'
                              : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.05))',
                            color: i < review.stars ? undefined : 'rgba(255,255,255,0.15)',
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <p className="mb-4 italic text-base leading-relaxed" style={{ color: 'rgba(232, 215, 198, 0.95)' }}>"{review.feedback}"</p>
                  <p className="font-bold text-sm" style={{ color: '#D4A574' }}>— {review.userName}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
