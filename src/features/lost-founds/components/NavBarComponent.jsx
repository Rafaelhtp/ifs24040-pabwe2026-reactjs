import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import {
  IconMenu2,
  IconUser,
  IconLogout,
  IconChevronDown,
} from "@tabler/icons-react";

export default function NavbarComponent({ onToggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(
      asyncSetIsAuthLogout(() => {
        navigate("/auth/login");
      })
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Menu"
        >
          <IconMenu2 size={22} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Delcom Logo" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-slate-800">
            Delcom <span className="text-blue-600">Lost & Founds</span>
          </span>
        </Link>
      </div>

      {/* User Session & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 rounded-full border border-slate-200 py-1.5 pl-2 pr-3 transition-colors hover:bg-slate-50"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-600">
            {profile?.photo ? (
            <img
              src={profile.photo}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{profile?.name ? profile.name[0].toUpperCase() : "U"}</span>
          )}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:inline">
            {profile?.name || "Pengguna"}
          </span>
          <IconChevronDown size={16} className="text-slate-400" />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <IconUser size={18} />
                Profil Saya
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <IconLogout size={18} />
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}