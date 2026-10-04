import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Pastikan useNavigate diimpor
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthLogin,
  setIsAuthLoginActionCreator,
} from "../states/action";
import { asyncSetProfile } from "../../users/states/action";
import apiHelper from "../../../helpers/apiHelper";
import { IconMail, IconLock, IconLoader2, IconLogin } from "@tabler/icons-react";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inisialisasi navigate

  const isAuthLogin = useSelector((state) => state.isAuthLogin);

  const [loading, setLoading] = useState(false);
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");

  // 1. BEGITU LOGIN BERHASIL (isAuthLogin === true), LANGSUNG PINDAH KE "/"
  useEffect(() => {
    if (isAuthLogin) {
      dispatch(setIsAuthLoginActionCreator(false));
      navigate("/", { replace: true });
    }
  }, [isAuthLogin, dispatch, navigate]);
  
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await dispatch(asyncSetIsAuthLogin(email, password));
      
      // Pengecekan cadangan: jika token sudah ada di storage, langsung lempar ke "/"
      if (apiHelper.getAccessToken()) {
        navigate("/", { replace: true });
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="space-y-4">
      <div>
        <label
          htmlFor="login-email-input"
          className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
        >
          Alamat Email
        </label>
        <div className="relative">
          <IconMail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="email"
            id="login-email-input"
            data-testid="login-email-input"
            aria-label="Alamat Email"
            value={email}
            onChange={onEmailChange}
            placeholder="nama@email.com"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="login-password-input"
          className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5"
        >
          Kata Sandi
        </label>
        <div className="relative">
          <IconLock
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="password"
            id="login-password-input"
            data-testid="login-password-input"
            aria-label="Kata Sandi"
            value={password}
            onChange={onPasswordChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          id="login-submit-button"
          data-testid="login-submit-button"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <IconLoader2 size={18} className="animate-spin" />
              <span>Sedang Masuk...</span>
            </>
          ) : (
            <>
              <IconLogin size={18} stroke={2.5} />
              <span>Masuk Sekarang</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default LoginPage;