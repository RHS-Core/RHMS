import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {

    return (

        <>

            <Header />

            <div className="d-flex">

                <Sidebar />

                <div
                    className="p-4 flex-grow-1 bg-light"
                    style={{ minHeight: "100vh" }}
                >
                    {children}
                </div>

            </div>

            <Footer />

        </>

    );

}

export default Layout;