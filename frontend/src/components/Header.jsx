
import React from "react";
function Header() {
  return (
    <header
      style={{
        height: "70px",
        backgroundColor: "#1976d2",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <h2>RHMS</h2>
      <span>Xin chào!</span>
    </header>
  );
}

export default Header;