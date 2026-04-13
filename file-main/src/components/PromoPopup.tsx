import React, { useEffect, useState } from "react";

const PromoPopup = () => {
  const [show, setShow] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("promo_seen");
    if (!seen) {
      setTimeout(() => {
        setShow(true);
        setTimeout(() => setAnimateIn(true), 50);
      }, 600);
      localStorage.setItem("promo_seen", "true");
    }
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setShow(false), 300);
  };

  if (!show) return null;

  return (
    <>
      {/* Keyframes injected via style tag */}
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
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(193,154,107,0.2)",
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
                  background: "linear-gradient(90deg, #c19a6b, #8b6914, #c19a6b)",
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

            {/* Terms */}
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                marginTop: "10px",
                marginBottom: "0",
              }}
            >
              *Valid for first-time users. Max 20 uses.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoPopup;
