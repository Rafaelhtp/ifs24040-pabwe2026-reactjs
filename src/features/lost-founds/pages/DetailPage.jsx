import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetLostFoundById,
  asyncDeleteLostFound,
  setIsLostFoundDeletedActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconPhoto,
  IconClock,
  IconUser,
  IconCheck,
  IconAlertCircle,
  IconPackage,
} from "@tabler/icons-react";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lostFound = useSelector((state) => state.lostFound);
  const isLostFound = useSelector((state) => state.isLostFound);
  const isLostFoundDeleted = useSelector((state) => state.isLostFoundDeleted);
  const profile = useSelector((state) => state.profile);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(asyncSetLostFoundById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isLostFoundDeleted) {
      dispatch(setIsLostFoundDeletedActionCreator(false));
      navigate("/");
    }
  }, [isLostFoundDeleted, dispatch, navigate]);

  const handleDelete = () => {
    showConfirmDialog("Apakah kamu yakin ingin menghapus laporan ini?", () => {
      dispatch(asyncDeleteLostFound(id));
    });
  };

  if (isLostFound || !lostFound) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-bold text-slate-900">
          Memuat rincian laporan...
        </p>
      </div>
    );
  }


  // Cek apakah laporan milik akun yang sedang login
  const isOwner = profile?.id === lostFound.user_id;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Tombol Kembali */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
      >
        <IconArrowLeft size={18} />
        Kembali ke Daftar Laporan
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {/* Cover Gambar Adaptif */}
        <div className="relative max-h-96 w-full overflow-hidden bg-slate-100">
          {lostFound.cover ? (
            <img
              src={lostFound.cover}
              alt={lostFound.title}
              className="h-full w-full max-h-96 object-contain bg-slate-900"
            />
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center text-slate-300">
              <IconPackage size={60} />
              <p className="mt-2 text-xs font-medium text-slate-400">
                Belum ada foto cover
              </p>
            </div>
          )}

          {/* Tombol Ubah Cover (Bila Pemilik Laporan) */}
          {isOwner && (
            <button
              onClick={() => setIsCoverOpen(true)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-xs transition-colors hover:bg-white"
            >
              <IconPhoto size={16} />
              Ubah Cover
            </button>
          )}
        </div>

        {/* Konten Rincian */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-bold text-white shadow-xs ${
                lostFound.status === "lost" ? "bg-rose-500" : "bg-emerald-500"
              }`}
            >
              {lostFound.status === "lost" ? "🔴 BARANG HILANG" : "🟢 BARANG DITEMUKAN"}
            </span>

            {lostFound.is_completed ? (
              <span className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                <IconCheck size={14} /> KASUS SELESAI
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-xs">
                <IconAlertCircle size={14} /> DALAM PROSES
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {lostFound.title}
          </h1>

          {/* Metadata Pelapor */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-slate-100 py-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <IconUser size={16} className="text-slate-400" />
              Dilaporkan oleh: {lostFound.user?.name || "Pengguna"}
            </span>
            <span className="flex items-center gap-1.5">
              <IconClock size={16} className="text-slate-400" />
              {formatDate ? formatDate(lostFound.created_at) : lostFound.created_at}
            </span>
          </div>

          {/* Deskripsi */}
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Deskripsi & Ciri-Ciri
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {lostFound.description}
            </p>
          </div>

          {/* Tombol Aksi Pemilik */}
          {isOwner && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-colors hover:bg-blue-700"
              >
                <IconEdit size={18} />
                Edit Informasi Laporan
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
              >
                <IconTrash size={18} />
                Hapus Laporan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Edit Informasi */}
      <ChangeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={lostFound}
        onSuccess={() => {
          dispatch(asyncSetLostFoundById(id));
        }}
      />

      {/* Modal Ganti Cover */}
      <ChangeCoverModal
        isOpen={isCoverOpen}
        onClose={() => setIsCoverOpen(false)}
        itemId={id}
        onSuccess={() => {
          dispatch(asyncSetLostFoundById(id));
        }}
      />
    </div>
  );
}