import React from "react";

const ads = [
  {
    title: "Learn to Code",
    description: "Join our free online coding bootcamp. Limited spots available!",
  }
];

function VerticalAdSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "200px",
        height: "400px",
        backgroundColor: "#f2f2f2",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
        gap: "24px",
        padding: "32px 0",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {ads.map((ad, idx) => (
        <div
          key={idx}
          style={{
            width: "160px",
            minHeight: "180px",
            background: "#fff",
            borderRadius: "8px",
            padding: "24px 12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
            textAlign: "center",
            margin: "8px 0"
          }}
        >
          <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 10 }}>{ad.title}</div>
          <div style={{ fontSize: "0.95rem", color: "#555" }}>{ad.description}</div>
        </div>
      ))}
    </div>
  );
}

export default VerticalAdSection;