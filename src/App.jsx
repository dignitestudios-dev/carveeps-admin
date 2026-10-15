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
import DealershipApplications from "./pages/DealershipApplications";
import Notifications from "./pages/Notifications";
import DealersProfile from "./pages/DealersProfile";
import Roles from "./pages/Roles";
import Subadmins from "./pages/Subadmins";
import Transactions from "./pages/Transactions";
import DealershipsOtherDetails from "./pages/DealershipsOtherDetails";
import Tickets from "./pages/Tickets";
import UpdatePasswordInternal from "./pages/UpdatePasswordInternal";
import CommissionSettings from "./pages/CommissionSettings";
import PermissionGuard from "./components/global/PermissionGuard";

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
      <Route
        path="/commission-settings"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="config">
                <CommissionSettings />
              </PermissionGuard>
            }
          />
        }
      />

      {/* Dashboard pages */}
      <Route
        path="/dashboard"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="dashboard">
                <Dashboard />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/users"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="users">
                <Users />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/roles"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="roles">
                <Roles />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/subadmins"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="subadmins">
                <Subadmins />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/subadmin"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="subadmins">
                <Subadmins />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/dealerships"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="dealerships">
                <Dealerships />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/dealership-applications"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="dealerships">
                <DealershipApplications />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/dealerships/:id"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="dealerships">
                <DealersProfile />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/dealerships/revenue/:id"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="dealerships">
                <DealershipsOtherDetails />
              </PermissionGuard>
            }
          />
        }
      />

      <Route
        path="/notifications"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="notifications">
                <Notifications />
              </PermissionGuard>
            }
          />
        }
      />
      <Route
        path="/transactions"
        element={<GlobalLayout page={<Transactions />} />}
      />

      <Route
        path="/tickets"
        element={
          <GlobalLayout
            page={
              <PermissionGuard module="tickets">
                <Tickets />
              </PermissionGuard>
            }
          />
        }
      />
    </Routes>
  );
}

export default App;
