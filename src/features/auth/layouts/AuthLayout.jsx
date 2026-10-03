import React from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { IconReportSearch } from "@tabler/icons-react";

export default function AuthLayout() {
  const location = useLocation();
  const token = apiHelper.getAccessToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  const isLoginActive = location.pathname === "/auth/login";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-600 items-center justify-center text-white shadow-xl mb-3">
          <IconReportSearch size={32} stroke={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Delcom <span className="text-blue-700">Lost &amp; Founds</span>
        </h1>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Aplikasi Pelaporan Barang Hilang &amp; Temuan Kampus
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200">
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
            <NavLink
              to="/auth/login"
              className={`flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all ${
                isLoginActive
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Masuk Akun
            </NavLink>
            <NavLink
              to="/auth/register"
              className={`flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all ${
                !isLoginActive
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Daftar Baru
            </NavLink>
          </div>

          <Outlet />
        </div>
      </div>
    </main>
  );
}