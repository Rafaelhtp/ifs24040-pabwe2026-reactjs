import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  IconUser,
  IconMail,
  IconLock,
  IconLockCheck,
  IconLoader2,
  IconUserPlus,
} from "@tabler/icons-react";
import useInput from "../../../hooks/useInput";
import TextField from "../../../components/TextField";
import { asyncSetIsAuthRegister } from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {};
  if (!name.trim()) errors.name = "Nama wajib diisi.";
  else if (name.trim().length < 3) errors.name = "Nama minimal 3 karakter.";
  if (!email.trim()) errors.email = "Email wajib diisi.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Format email tidak valid.";
  if (!password) errors.password = "Kata sandi wajib diisi.";
  else if (password.length < 6) errors.password = "Kata sandi minimal 6 karakter.";
  if (confirmPassword !== password) errors.confirmPassword = "Konfirmasi kata sandi tidak sama.";
  return errors;
}

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmPasswordChange] = useInput("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function onSubmitHandler(event) {
    event.preventDefault();
    const validation = validateRegister({ name, email, password, confirmPassword });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    const success = await dispatch(asyncSetIsAuthRegister(name.trim(), email.trim(), password));
    setLoading(false);
    if (success) navigate("/auth/login");
  }

  return (
    <form onSubmit={onSubmitHandler} noValidate className="space-y-4" aria-label="Form registrasi">
      <TextField
        id="register-name"
        label="Nama Lengkap"
        icon={IconUser}
        value={name}
        onChange={onNameChange}
        placeholder="Nama lengkap Anda"
        autoComplete="name"
        error={errors.name}
      />
      <TextField
        id="register-email"
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
        id="register-password"
        label="Kata Sandi"
        type="password"
        icon={IconLock}
        value={password}
        onChange={onPasswordChange}
        placeholder="Minimal 6 karakter"
        autoComplete="new-password"
        error={errors.password}
      />
      <TextField
        id="register-confirm-password"
        label="Konfirmasi Kata Sandi"
        type="password"
        icon={IconLockCheck}
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        placeholder="Ulangi kata sandi"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? (
          <>
            <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
            <span>Mendaftarkan akun...</span>
          </>
        ) : (
          <>
            <IconUserPlus size={18} aria-hidden="true" />
            <span>Daftar Akun</span>
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="font-semibold text-blue-700 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
