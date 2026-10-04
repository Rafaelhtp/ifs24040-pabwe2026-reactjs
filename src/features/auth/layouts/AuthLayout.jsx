import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  IconReportSearch,
  IconMapPinSearch,
  IconCircleCheck,
  IconUsersGroup,
} from "@tabler/icons-react";
import { getAccessToken } from "../../../helpers/apiHelper";

const tabClass = ({ isActive }) =>
  `flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all ${
    isActive ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
  }`;

const highlights = [
  { icon: IconMapPinSearch, text: "Laporkan barang hilang atau temuan dalam hitungan detik." },
  { icon: IconCircleCheck, text: "Pantau status laporan hingga barang kembali ke pemiliknya." },
  { icon: IconUsersGroup, text: "Terhubung dengan seluruh civitas kampus." },
];

export default function AuthLayout() {
  // Pengguna yang sudah login tidak perlu melihat halaman autentikasi.
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Visual banner (desktop) */}
      <section
        aria-label="Banner aplikasi"
        className="relative hidden overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 p-12 text-white lg:flex lg:flex-col lg:justify-between"
      >
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-10 w-10" />
          <span className="text-lg font-bold tracking-tight">Delcom Lost &amp; Founds</span>
        </div>
        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Barang hilang? Temukan kembali bersama-sama.
          </h2>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-blue-50">
                <Icon size={22} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-blue-100">PABWE 2026 · Institut Teknologi Del</p>
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-white/10" />
      </section>

      {/* Kontainer form */}
      <section className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-600 text-white shadow-xl">
              <IconReportSearch size={32} stroke={2.2} aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Delcom <span className="text-blue-700">Lost &amp; Founds</span>
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Aplikasi Pelaporan Barang Hilang &amp; Temuan Kampus
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-xl shadow-slate-200/50 sm:px-10">
            <nav aria-label="Navigasi autentikasi" className="mb-6 flex rounded-2xl bg-slate-100 p-1">
              <NavLink to="/auth/login" className={tabClass}>
                Masuk
              </NavLink>
              <NavLink to="/auth/register" className={tabClass}>
                Daftar
              </NavLink>
            </nav>
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
}