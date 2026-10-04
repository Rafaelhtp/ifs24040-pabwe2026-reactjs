import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IconUser,
  IconMail,
  IconLock,
  IconCamera,
  IconLoader2,
  IconShieldLock,
  IconId,
} from "@tabler/icons-react";
import useInput from "../../../hooks/useInput";
import TextField from "../../../components/TextField";
import Avatar from "../../../components/Avatar";
import {
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SubmitButton({ loading, children, loadingText }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-800 disabled:opacity-60"
    >
      {loading && <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);

  const [name, onNameChange, setName] = useInput(profile?.name ?? "");
  const [email, onEmailChange, setEmail] = useInput(profile?.email ?? "");
  const [password, onPasswordChange, setPassword] = useInput("");
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput("");
  const [confirmPassword, onConfirmPasswordChange, setConfirmPassword] = useInput("");

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Sinkronkan form ketika profil selesai dimuat / diperbarui.
  useEffect(() => {
    setName(profile?.name ?? "");
    setEmail(profile?.email ?? "");
  }, [profile, setName, setEmail]);

  async function onSubmitProfile(event) {
    event.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = "Nama wajib diisi.";
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Format email tidak valid.";
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingProfile(true);
    await dispatch(asyncChangeProfile(name.trim(), email.trim()));
    setSavingProfile(false);
  }

  async function onSubmitPassword(event) {
    event.preventDefault();
    const errors = {};
    if (!password) errors.password = "Kata sandi saat ini wajib diisi.";
    if (newPassword.length < 6) errors.newPassword = "Kata sandi baru minimal 6 karakter.";
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Konfirmasi kata sandi tidak sama.";
    }
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingPassword(true);
    const success = await dispatch(
      asyncChangeProfilePassword(password, newPassword, confirmPassword)
    );
    setSavingPassword(false);
    if (success) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function onPhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    await dispatch(asyncChangeProfilePhoto(file));
    setUploadingPhoto(false);
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Profil Saya
        </h1>
        <p className="mt-1 text-sm text-slate-600">Kelola informasi akun dan keamanan Anda.</p>
      </header>

      <section className="flex flex-col items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:p-8">
        <div className="relative">
          <Avatar name={profile?.name} photo={profile?.photo} size="lg" />
          <label
            htmlFor="profile-photo-input"
            className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white shadow-md hover:bg-blue-800"
            title="Ganti foto profil"
          >
            {uploadingPhoto ? (
              <IconLoader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <IconCamera size={18} aria-hidden="true" />
            )}
            <span className="sr-only">Ganti foto profil</span>
          </label>
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPhotoChange}
            disabled={uploadingPhoto}
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900">{profile?.name ?? "-"}</h2>
          <p className="text-sm text-slate-600">{profile?.email ?? "-"}</p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700">
            <IconId size={14} aria-hidden="true" /> ID #{profile?.id ?? "-"}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            <IconUser size={20} className="text-blue-700" aria-hidden="true" />
            Informasi Profil
          </h2>
          <form onSubmit={onSubmitProfile} noValidate className="space-y-4" aria-label="Form profil">
            <TextField
              id="profile-name"
              label="Nama Lengkap"
              icon={IconUser}
              value={name}
              onChange={onNameChange}
              error={profileErrors.name}
            />
            <TextField
              id="profile-email"
              label="Alamat Email"
              type="email"
              icon={IconMail}
              value={email}
              onChange={onEmailChange}
              error={profileErrors.email}
            />
            <SubmitButton loading={savingProfile} loadingText="Menyimpan...">
              Simpan Perubahan
            </SubmitButton>
          </form>
        </section>

        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            <IconShieldLock size={20} className="text-amber-600" aria-hidden="true" />
            Ganti Kata Sandi
          </h2>
          <form
            onSubmit={onSubmitPassword}
            noValidate
            className="space-y-4"
            aria-label="Form kata sandi"
          >
            <TextField
              id="current-password"
              label="Kata Sandi Saat Ini"
              type="password"
              icon={IconLock}
              value={password}
              onChange={onPasswordChange}
              autoComplete="current-password"
              error={passwordErrors.password}
            />
            <TextField
              id="new-password"
              label="Kata Sandi Baru"
              type="password"
              icon={IconLock}
              value={newPassword}
              onChange={onNewPasswordChange}
              autoComplete="new-password"
              error={passwordErrors.newPassword}
            />
            <TextField
              id="confirm-new-password"
              label="Konfirmasi Kata Sandi Baru"
              type="password"
              icon={IconLock}
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              autoComplete="new-password"
              error={passwordErrors.confirmPassword}
            />
            <SubmitButton loading={savingPassword} loadingText="Memperbarui...">
              Perbarui Kata Sandi
            </SubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
}