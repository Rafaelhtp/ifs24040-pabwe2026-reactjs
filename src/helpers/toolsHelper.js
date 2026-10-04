/* global DELCOM_BASEURL */
import Swal from "sweetalert2";

export function showSuccessDialog(message) {
  return Swal.fire({
    title: "Berhasil",
    text: message,
    icon: "success",
    confirmButtonText: "Oke",
    confirmButtonColor: "#1d4ed8",
  });
}

export function showErrorDialog(message) {
  return Swal.fire({
    title: "Terjadi Kesalahan",
    text: message,
    icon: "error",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#b91c1c",
  });
}

// Mengembalikan Promise<boolean>: true jika pengguna menekan tombol konfirmasi.
export async function showConfirmDialog(message, confirmText = "Ya, lanjutkan") {
  const result = await Swal.fire({
    title: "Konfirmasi",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: "#b91c1c",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });
  return Boolean(result?.isConfirmed);
}

export function formatDate(date, withTime = true) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";

  const options = { day: "2-digit", month: "long", year: "numeric" };
  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return parsed.toLocaleString("id-ID", options);
}

// API mengembalikan path relatif (mis. "img/lost-founds/cover/1.png") atau URL penuh.
export function getImageUrl(path) {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  const origin = new URL(DELCOM_BASEURL).origin;
  return `${origin}/${String(path).replace(/^\/+/, "")}`;
}
