import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOtp from "./pages/VerifyOtp";
import ChangePassword from "./pages/ChangePassword";
import GlobalLayout from "./layout/GlobalLayout";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Dealerships from "./pages/Dealerships";
import Notifications from "./pages/Notifications";
import DealersProfile from "./pages/DealersProfile";

import Transactions from "./pages/Transactions";
import DealershipsOtherDetails from "./pages/DealershipsOtherDetails";
import Tickets from "./pages/Tickets";
import UpdatePasswordInternal from "./pages/UpdatePasswordInternal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route
        path="/update-password"
        element={<GlobalLayout page={<UpdatePasswordInternal />} />}
      />

      {/* Dashboard pages */}
      <Route
        path="/dashboard"
        element={<GlobalLayout page={<Dashboard />} />}
      />
      <Route path="/users" element={<GlobalLayout page={<Users />} />} />
      <Route
        path="/dealerships"
        element={<GlobalLayout page={<Dealerships />} />}
      />
      <Route
        path="/dealerships/:id"
        element={<GlobalLayout page={<DealersProfile />} />}
      />
      <Route
        path="/dealerships/revenue/:id"
        element={<GlobalLayout page={<DealershipsOtherDetails />} />}
      />

      <Route
        path="/notifications"
        element={<GlobalLayout page={<Notifications />} />}
      />
      <Route
        path="/transactions"
        element={<GlobalLayout page={<Transactions />} />}
      />

      <Route path="/tickets" element={<GlobalLayout page={<Tickets />} />} />
    </Routes>
  );
}

export default App;
