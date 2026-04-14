import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";

interface PromoPopupProps {
  user?: any;
  selectedCafeName?: string;
  userJustLoggedIn?: boolean;
  onNavigate?: (page: string, data?: any) => void;
}

const PROMO_STORAGE_KEY = "promo_seen";
const PROMO_TIME_KEY = "promo_time";
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

const PromoPopup: React.FC<PromoPopupProps> = ({
  user,
  selectedCafeName,
  userJustLoggedIn,
  onNavigate,
}) => {
  const [show, setShow] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [couponAlreadyUsed, setCouponAlreadyUsed] = useState(false);

  // ─── Check if coupon is already used by this user ─────────────
  useEffect(() => {
    if (!user?.email) return;

    const checkCouponUsage = async () => {
      try {
        // Quick validation check — send a dummy apply to see if already used
        const res = await fetch(`${BASE_URL}/api/user/apply-coupon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: "CAFFELINO",
            email: user.email,
            orderAmount: 9999, // high value so min-order check passes
            cafeName: "Chocolate Room Cafe",
          }),
        });
        const data = await res.json();
        if (!res.ok && data.message === "Coupon already used with this email") {
          setCouponAlreadyUsed(true);
        }
      } catch {
        // Silently fail — don't block popup
      }
    };
    checkCouponUsage();
  }, [user?.email]);

  // ─── Smart popup display logic ────────────────────────────────
  useEffect(() => {
    // ❌ Don't show if coupon already used by user
    if (couponAlreadyUsed) return;

    const promoSeen = localStorage.getItem(PROMO_STORAGE_KEY);
    const lastSeenTime = localStorage.getItem(PROMO_TIME_KEY);
    const now = Date.now();

    // 24h re-show: allow popup again after 24 hours
    const expiredCooldown =
      !lastSeenTime || now - parseInt(lastSeenTime, 10) > TWENTY_FOUR_HOURS;

    // Determine if popup not seen in this cooldown window
    const notSeenRecently = !promoSeen || expiredCooldown;

    // If cooldown expired, clear the flag so popup can show again
    if (expiredCooldown && promoSeen) {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }

    const isChocolateRoom =
      selectedCafeName &&
      selectedCafeName.toLowerCase().includes("chocolate room");

    const shouldShow =
      notSeenRecently &&
      (
        !user ||               // First time visitor (not logged in)
        userJustLoggedIn ||    // Just logged in / signed up
        isChocolateRoom        // Opened Chocolate Room page
      );

    // 🔥 HIGH CONVERSION: Always show when Chocolate Room is selected
    //    regardless of localStorage (unless coupon is used)
    const forceShow = isChocolateRoom && !couponAlreadyUsed;

    if (shouldShow || forceShow) {
      const timer = setTimeout(() => {
        setShow(true);
        setTimeout(() => setAnimateIn(true), 50);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, userJustLoggedIn, selectedCafeName, couponAlreadyUsed]);

  // ─── Close handler ────────────────────────────────────────────
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setShow(false), 300);
    // Mark as seen + store timestamp
    localStorage.setItem(PROMO_STORAGE_KEY, "true");
    localStorage.setItem(PROMO_TIME_KEY, Date.now().toString());
  };

  if (!show) return null;

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popupFadeOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.85) translateY(20px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(193, 154, 107, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(193, 154, 107, 0); }
        }
        @keyframes confettiBurst {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.5); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: animateIn ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
          backdropFilter: animateIn ? "blur(6px)" : "blur(0px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          transition: "all 0.3s ease",
          padding: "16px",
        }}
        onClick={handleClose}
      >
        <div
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #fdf8f3 100%)",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "380px",
            textAlign: "center" as const,
            padding: "0",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(193,154,107,0.2)",
            position: "relative" as const,
            overflow: "hidden",
            animation: animateIn
              ? "popupFadeIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
              : "popupFadeOut 0.3s ease forwards",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              border: "none",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 10,
              color: "#666",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ff4444";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              e.currentTarget.style.color = "#666";
            }}
          >
            ×
          </button>

          {/* Image Section */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
              alt="Chocolate Room Cafe"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Gradient overlay on image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: "linear-gradient(transparent, #fdf8f3)",
              }}
            />
            {/* Discount badge */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "linear-gradient(135deg, #c19a6b, #8b6914)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              ⚡ LIMITED OFFER
            </div>
          </div>

          {/* Content Section */}
          <div style={{ padding: "16px 24px 24px" }}>
            {/* Title */}
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#2d1810",
                marginBottom: "6px",
                marginTop: "0",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
              }}
            >
              Flat ₹100 OFF
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "14px",
                color: "#6b4c3b",
                marginBottom: "8px",
                marginTop: "0",
                lineHeight: "1.5",
              }}
            >
              Use code{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #c19a6b, #8b6914, #c19a6b)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "800",
                  fontSize: "16px",
                  animation: "shimmer 2s linear infinite",
                }}
              >
                CAFFELINO
              </span>{" "}
              at Chocolate Room Cafe
            </p>

            {/* Offer Description */}
            <div
              style={{
                background: "#fef7ef",
                border: "1px dashed #c19a6b",
                borderRadius: "12px",
                padding: "10px 16px",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#8b6c56",
                  margin: "0",
                  fontWeight: "500",
                }}
              >
                🎉 Get flat <strong>₹100 off</strong> on orders above{" "}
                <strong>₹700</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoPopup;
