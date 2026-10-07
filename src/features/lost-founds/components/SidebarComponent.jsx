import React from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import {
  IconReportSearch,
  IconChartBar,
  IconUsers,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";

export const MENU_ITEMS = [
  { name: "Dashboard / Laporan", path: "/", icon: IconReportSearch },
  { name: "Statistik", path: "/#statistik", icon: IconChartBar },
  { name: "Pengguna", path: "/users", icon: IconUsers },
  { name: "Profil Saya", path: "/profile", icon: IconUserCircle },
];

const baseLink =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all";
const activeLink = "bg-blue-700 text-white shadow-md shadow-blue-200";
const idleLink = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

export default function SidebarComponent({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();

  // NavLink tidak membedakan hash, jadi status aktif dihitung manual.
  function isActive(path) {
    const [pathname, hash] = path.split("#");
    if (hash) return location.pathname === pathname && location.hash === `#${hash}`;
    if (pathname === "/") return location.pathname === "/" && location.hash !== "#statistik";
    return location.pathname.startsWith(pathname);
  }

  return (
    <>
      {isOpen && (
        <div
          data-testid="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-label="Menu utama"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 lg:hidden">
          <span className="font-bold text-slate-800">Menu Navigasi</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu navigasi"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <IconX size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {MENU_ITEMS.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`${baseLink} ${active ? activeLink : idleLink}`}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Delcom Lost &amp; Founds</p>
            <p className="mt-0.5">PABWE 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}

SidebarComponent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
