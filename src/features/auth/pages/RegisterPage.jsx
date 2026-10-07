import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthRegister,
  setIsAuthRegisterActionCreator,
} from "../states/action";
import { IconUser, IconMail, IconLock, IconLoader2, IconUserPlus } from "@tabler/icons-react";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthRegister = useSelector((state) => state.isAuthRegister);

  const [loading, setLoading] = useState(false);
  const [name, onChangeName, setName] = useInput("");
  const [email, onChangeEmail, setEmail] = useInput("");
  const [password, onChangePassword, setPassword] = useInput("");

  // 1. Periksa apakah register telah selesai diproses
  useEffect(() => {
    if (isAuthRegister === true) {
      setLoading(false);
      dispatch(setIsAuthRegisterActionCreator(false));
      setName("");
      setEmail("");
      setPassword("");
      navigate("/auth/login");
    } else if (isAuthRegister === false) {
      setLoading(false);
    }
  }, [isAuthRegister, dispatch, setName, setEmail, setPassword, navigate]);

  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    try {
      // Thunk biasa (bukan createAsyncThunk), jadi tidak ada .unwrap()
      await dispatch(asyncSetIsAuthRegister(name, email, password));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="space-y-4">
      <div>
        <label
          htmlFor="register-name-input"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Nama Lengkap
        </label>
        <div className="relative">
          <IconUser
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            id="register-name-input"
            data-testid="register-name-input"
            name="name"
            aria-label="Nama Lengkap"
            autoComplete="name"
            value={name}
            onChange={onChangeName}
            placeholder="Nama Lengkap Anda"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-email-input"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Alamat Email
        </label>
        <div className="relative">
          <IconMail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="email"
            id="register-email-input"
            data-testid="register-email-input"
            name="email"
            aria-label="Alamat Email"
            autoComplete="email"
            value={email}
            onChange={onChangeEmail}
            placeholder="nama@email.com"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-password-input"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Kata Sandi
        </label>
        <div className="relative">
          <IconLock
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="password"
            id="register-password-input"
            data-testid="register-password-input"
            name="password"
            aria-label="Kata Sandi"
            autoComplete="new-password"
            value={password}
            onChange={onChangePassword}
            placeholder="Minimal 6 karakter"
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          id="register-submit-button"
          data-testid="register-submit-button"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <IconLoader2 size={18} className="animate-spin" />
              <span>Mendaftarkan Akun...</span>
            </>
          ) : (
            <>
              <IconUserPlus size={18} stroke={2.5} />
              <span>Daftar Akun</span>
            </>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-slate-600 pt-2">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="font-semibold text-blue-700 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
