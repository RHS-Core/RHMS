import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        background: "#f3f3f3",
        padding: "20px",
      }}
    >
      <p><Link to="/">Dashboard</Link></p>
      <p><Link to="/rooms">Danh sách phòng</Link></p>
      <p><Link to="/booking">Đặt phòng</Link></p>
      <p><Link to="/checkin">Check In</Link></p>
      <p><Link to="/checkout">Check Out</Link></p>
    </aside>
  );
}

export default Sidebar;