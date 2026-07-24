import React from "react";

function Header() {
    return (
        <nav className="navbar navbar-dark bg-primary shadow-sm px-4">
            <div className="container-fluid">

                <span className="navbar-brand mb-0 h1">
                    🏨 RHMS
                </span>

                <div className="text-white">

                    <i className="bi bi-person-circle me-2"></i>

                    Xin chào, Admin

                    <button className="btn btn-light btn-sm ms-3">
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Header;