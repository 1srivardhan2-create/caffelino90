import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export const PromoPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show once per local storage
    const seen = localStorage.getItem("caffelino_popup_seen");

    if (!seen) {
      setTimeout(() => setShow(true), 500); // Small delay feels more natural
      localStorage.setItem("caffelino_popup_seen", "true");
    }
  }, []);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        
        {/* CLOSE BUTTON */}
        <button style={styles.close} onClick={() => setShow(false)}>
          <X size={24} color="#666" />
        </button>

        {/* IMAGE */}
        <img
          src="https://images.jdmagicbox.com/comp/mathura/dc/9999px565.x565.170531122501.g3dc/catalogue/the-chocolate-room-mathura-tphz3nllj3.jpg" // Used a relevant image for The Chocolate Room Cafe
          alt="Chocolate Room Offer"
          style={styles.image}
        />

        {/* TEXT */}
        <h2 style={styles.title}>₹100 OFF with CAFFELINO</h2>
        <p style={styles.subtitle}>Only for Chocolate Room Cafe</p>

        {/* BUTTON */}
        <button
          style={styles.button}
          onClick={() => {
            setShow(false);
            // Can be updated for proper routing
            window.location.href = "/cafe/chocolate-room";
          }}
        >
          Order Now
        </button>

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  } as React.CSSProperties,
  popup: {
    background: "#fff",
    padding: "24px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  } as React.CSSProperties,
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "16px"
  } as React.CSSProperties,
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px"
  } as React.CSSProperties,
  subtitle: {
    fontSize: "15px",
    color: "#666",
    marginBottom: "20px",
    fontWeight: "500"
  } as React.CSSProperties,
  button: {
    width: "100%",
    padding: "14px 20px",
    background: "#be9d80",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s"
  } as React.CSSProperties,
  close: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#f1f1f1",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    zIndex: 10
  } as React.CSSProperties
};

export default PromoPopup;
