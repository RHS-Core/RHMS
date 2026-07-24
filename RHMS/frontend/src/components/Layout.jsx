import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 130px)",
        }}
      >
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "20px",
          }}
        >
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Layout;