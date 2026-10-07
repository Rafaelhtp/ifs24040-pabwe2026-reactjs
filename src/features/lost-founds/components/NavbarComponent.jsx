import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconMenu2, IconUser, IconLogout, IconChevronDown } from "@tabler/icons-react";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import Avatar from "../../../components/Avatar";

export default function NavbarComponent({ onToggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function onLogout() {
    setDropdownOpen(false);
    const result = await showConfirmDialog("Anda yakin ingin keluar dari aplikasi?");
    if (!result?.isConfirmed) return;
    await dispatch(asyncSetIsAuthLogout());
    navigate("/auth/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <IconMenu2 size={22} aria-hidden="true" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo Delcom Lost & Founds" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-slate-800">
            Delcom <span className="text-blue-700">Lost &amp; Founds</span>
          </span>
        </Link>
      </div>

      <div className="relative flex items-center gap-3">
        <span
          className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex"
          title="Status sesi"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Sesi aktif
        </span>

        <button
          type="button"
          onClick={() => setDropdownOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          aria-label="Menu profil"
          className="flex items-center gap-2.5 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-slate-50"
        >
          <Avatar name={profile?.name} photo={profile?.photo} size="sm" />
          <span className="hidden text-sm font-medium text-slate-700 md:inline">
            {profile?.name ?? "Pengguna"}
          </span>
          <IconChevronDown size={16} className="text-slate-500" aria-hidden="true" />
        </button>

        {dropdownOpen && (
          <>
            <div
              data-testid="dropdown-backdrop"
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div
              role="menu"
              className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
            >
              <div className="border-b border-slate-100 px-3 pb-2 pt-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {profile?.name ?? "Pengguna"}
                </p>
                <p className="truncate text-xs text-slate-500">{profile?.email ?? "-"}</p>
              </div>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <IconUser size={18} aria-hidden="true" />
                Profil Saya
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <IconLogout size={18} aria-hidden="true" />
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}