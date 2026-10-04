let _swal = null;
async function getSwal() {
  if (!_swal) {
    const mod = await import("sweetalert2");
    _swal = mod.default || mod;
  }
  return _swal;
}

export async function showErrorDialog(message) {
  const Swal = await getSwal();
  return Swal.fire({
    title: "Terjadi Kesalahan",
    text: message,
    icon: "error",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#991b1b",
    color: "#0f172a",
    background: "#ffffff",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
    return result;
  });
}

export async function showWarningDialog(message) {
  const Swal = await getSwal();
  return Swal.fire({
    title: "Peringatan",
    text: message,
    icon: "warning",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#b45309",
    color: "#0f172a",
    background: "#ffffff",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
    return result;
  });
}

export async function showSuccessDialog(message) {
  const Swal = await getSwal();
  return Swal.fire({
    title: "Tindakan Berhasil",
    text: message,
    icon: "success",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#047857",
    color: "#0f172a",
    background: "#ffffff",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
    return result;
  });
}

export async function showConfirmDialog(message, onConfirmed) {
  const Swal = await getSwal();
  const result = await Swal.fire({
    title: "Konfirmasi",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    confirmButtonColor: "#1d4ed8",
    cancelButtonColor: "#334155",
    color: "#0f172a",
    background: "#ffffff",
  });
  if (result.isConfirmed && typeof onConfirmed === "function") {
    onConfirmed();
  }
  return result;
}

export function formatDate(date) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getImageUrl(path) {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  const baseUrl =
    typeof DELCOM_BASEURL !== "undefined"
      ? DELCOM_BASEURL
      : "https://open-api.delcom.org/api/v1";
  const origin = new URL(baseUrl).origin;
  return `${origin}/${String(path).replace(/^\/+/, "")}`;
}
