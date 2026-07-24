import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    return (

        <div
            className="bg-dark text-white p-3"
            style={{
                minHeight: "100vh",
                width: "240px"
            }}
        >

            <h5 className="mb-4">
                MENU
            </h5>

            <ul className="nav flex-column">

                <li className="nav-item mb-2">
                    <Link className="nav-link text-white" to="/">
                        <i className="bi bi-house me-2"></i>
                        Dashboard
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link className="nav-link text-white" to="/rooms">
                        <i className="bi bi-door-open me-2"></i>
                        Quản lý phòng
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link className="nav-link text-white" to="/booking">
                        <i className="bi bi-calendar-check me-2"></i>
                        Đặt phòng
                    </Link>
                </li>

                <li className="nav-item mb-2">
                    <Link className="nav-link text-white" to="/checkin">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Check In
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="/checkout">
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Check Out
                    </Link>
                </li>

            </ul>

        </div>

    );
}

export default Sidebar;