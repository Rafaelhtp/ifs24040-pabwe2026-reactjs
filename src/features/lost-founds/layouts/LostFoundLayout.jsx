import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconLoader2 } from "@tabler/icons-react";
import { getAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { asyncSetProfile } from "../../users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);
  const token = getAccessToken();

  // Verifikasi token dengan memuat profil pengguna aktif.
  useEffect(() => {
    if (!token || profile) return;
    let active = true;
    Promise.resolve(dispatch(asyncSetProfile())).then((ok) => {
      if (active && !ok) {
        removeAccessToken();
        setSessionValid(false);
      }
    });
    return () => {
      active = false;
    };
  }, [token, profile, dispatch]);

  // Route guarding
  if (!token || !sessionValid) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!profile && !isProfile) {
    return (
      <main id="main-content" role="main" tabIndex="-1" className="flex min-h-screen items-center justify-center bg-slate-50 outline-none">
        <h1 className="sr-only">Memverifikasi Sesi Pengguna</h1>
        <div role="status" className="flex items-center">
          <IconLoader2 size={32} className="animate-spin text-blue-700" aria-hidden="true" />
          <span className="ml-3 text-sm font-medium text-slate-700">Memverifikasi sesi...</span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
      >
        Lewati ke konten utama
      </a>
      <NavbarComponent onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <div className="flex">
        <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="main-content" tabIndex="-1" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}