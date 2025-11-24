import React from "react";

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
  return (
    <Button
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 6,
        border: "none",
        cursor: props.disabled ? "not-allowed" : "pointer",
        backgroundColor: props.disabled ? "#999" : "#2563eb",
        color: "white",
        fontWeight: 600
      }}
    />
  );
}
