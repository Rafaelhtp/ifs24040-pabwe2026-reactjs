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
      <div role="status" className="flex min-h-screen items-center justify-center bg-slate-50">
        <IconLoader2 size={32} className="animate-spin text-blue-700" aria-hidden="true" />
        <span className="ml-3 text-sm font-medium text-slate-600">Memverifikasi sesi...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <div className="flex">
        <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}