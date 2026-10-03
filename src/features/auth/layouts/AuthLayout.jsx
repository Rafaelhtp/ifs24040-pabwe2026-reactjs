import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { IconReportSearch } from "@tabler/icons-react";

function AuthLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  // Jika token ada, muat profil pengguna
  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    }
  }, [dispatch]);

  // Jika profil berhasil dimuat (sudah login), langsung lempar ke dashboard
  useEffect(() => {
    if (isProfile) {
      if (typeof setIsProfile === "function") {
        dispatch(setIsProfile(false));
      }
      if (profile) {
        navigate("/");
      }
    }
  }, [isProfile, profile, dispatch, navigate]);

  // Jika pengguna sudah terautentikasi penuh, lindungi rute auth
  if (apiHelper.getAccessToken() && profile) {
    return <Navigate to="/" replace />;
  }

  const isLoginActive = location.pathname === "/auth/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo / Ikon Lost & Founds */}
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-3">
          <IconReportSearch size={32} stroke={2.5} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Delcom <span className="text-blue-600">Lost & Founds</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Aplikasi Pelaporan Barang Hilang & Temuan Kampus
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
          {/* Tabs Masuk / Daftar */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
            <NavLink
              to="/auth/login"
              className={`flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all ${
                isLoginActive
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Masuk Akun
            </NavLink>
            <NavLink
              to="/auth/register"
              className={`flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all ${
                !isLoginActive
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Daftar Baru
            </NavLink>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;