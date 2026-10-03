import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apiHelper from "../../../helpers/apiHelper"; // Menggunakan default import
import { asyncSetProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavBarComponent";
import SidebarComponent from "../components/SideBarComponent";

export default function LostFoundLayout() {
  const token = apiHelper.getAccessToken(); // Mengambil token lewat apiHelper
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verifikasi sesi & muat profil pengguna
  useEffect(() => {
    if (token && !profile) {
      if (typeof asyncSetProfile === "function") {
        dispatch(asyncSetProfile());
      }
    }
  }, [token, profile, dispatch]);

  // Route Guarding: jika tidak ada access token, arahkan ke login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <SidebarComponent
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}