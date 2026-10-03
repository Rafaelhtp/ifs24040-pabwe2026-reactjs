import React from "react";
import { NavLink } from "react-router-dom";
import {
  IconReportSearch,
  IconChartBar,
  IconUsers,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";

export default function SidebarComponent({ isOpen, onClose }) {
  const menuItems = [
    { name: "Dashboard & Laporan", path: "/", icon: IconReportSearch },
    { name: "Daftar Pengguna", path: "/users", icon: IconUsers },
    { name: "Profil Saya", path: "/profile", icon: IconUserCircle },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 lg:hidden">
          <span className="font-bold text-slate-800">Menu Navigasi</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX size={20} />
          </button>
        </div>

        <button
          onClick={onClose}
          aria-label="Tutup Menu Sidebar"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <IconX size={20} />
        </button>

        <button
          onClick={onClose}
          aria-label="Tutup Menu Sidebar"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <span className="sr-only">Tutup Menu Sidebar</span>
          <IconX size={20} aria-hidden="true" />
        </button>

        <nav className="flex-1 space-y-1.5 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Delcom Lost & Founds</p>
            <p className="mt-0.5">Praktikum 4 PABWE 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}