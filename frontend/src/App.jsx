import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/hotel/Dashboard";
import Rooms from "./pages/hotel/Rooms";
import Booking from "./pages/hotel/Booking";
import CheckIn from "./pages/hotel/CheckIn";
import CheckOut from "./pages/hotel/CheckOut";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/checkout" element={<CheckOut />} />
      </Routes>
    </Layout>
  );
}

export default App;