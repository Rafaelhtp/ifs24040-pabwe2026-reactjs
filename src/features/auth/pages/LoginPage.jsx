import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IconMail, IconLock, IconLoader2, IconLogin } from "@tabler/icons-react";
import useInput from "../../../hooks/useInput";
import TextField from "../../../components/TextField";
import { asyncSetIsAuthLogin } from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email wajib diisi.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Format email tidak valid.";
  if (!password) errors.password = "Kata sandi wajib diisi.";
  else if (password.length < 6) errors.password = "Kata sandi minimal 6 karakter.";
  return errors;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function onSubmitHandler(event) {
    event.preventDefault();
    const validation = validateLogin({ email, password });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    const success = await dispatch(asyncSetIsAuthLogin(email.trim(), password));
    setLoading(false);
    if (success) navigate("/", { replace: true });
  }

  return (
    <form onSubmit={onSubmitHandler} noValidate className="space-y-4" aria-label="Form login">
      <TextField
        id="login-email"
        label="Alamat Email"
        type="email"
        icon={IconMail}
        value={email}
        onChange={onEmailChange}
        placeholder="nama@email.com"
        autoComplete="email"
        error={errors.email}
      />
      <TextField
        id="login-password"
        label="Kata Sandi"
        type="password"
        icon={IconLock}
        value={password}
        onChange={onPasswordChange}
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password}
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? (
          <>
            <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
            <span>Sedang masuk...</span>
          </>
        ) : (
          <>
            <IconLogin size={18} aria-hidden="true" />
            <span>Masuk Sekarang</span>
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link to="/auth/register" className="font-semibold text-blue-700 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}