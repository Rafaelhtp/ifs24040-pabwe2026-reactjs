import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncCreateLostFound,
  setIsLostFoundAddedActionCreator,
} from "../states/action";
import { IconX, IconPlus } from "@tabler/icons-react";

export default function AddModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const isLostFoundAdd = useSelector((state) => state.isLostFoundAdd);
  const isLostFoundAdded = useSelector((state) => state.isLostFoundAdded);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost"); // 'lost' atau 'found'

  useEffect(() => {
    if (isLostFoundAdded) {
      setTitle("");
      setDescription("");
      setStatus("lost");
      dispatch(setIsLostFoundAddedActionCreator(false));
      if (onSuccess) onSuccess();
      onClose();
    }
  }, [isLostFoundAdded, dispatch, onClose, onSuccess]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    dispatch(asyncCreateLostFound({ title, description, status }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Tambah Laporan Baru
          </h2>
          <button
            onClick={onClose}
            aria-label="Tutup Dialog Tambah Laporan"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Jenis Laporan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("lost")}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  status === "lost"
                    ? "border-rose-500 bg-rose-50 text-rose-600"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                🔴 Barang Hilang (Lost)
              </button>
              <button
                type="button"
                onClick={() => setStatus("found")}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  status === "found"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                🟢 Barang Ditemukan (Found)
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Judul Barang
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kunci Motor Honda Vario Hitam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Deskripsi Lengkap
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan ciri-ciri barang, lokasi terakhir dilihat/ditemukan, dan kontak..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Batal Tambah Laporan"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundAdd}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
            >
              <IconPlus size={18} />
              {isLostFoundAdd ? "Menyimpan..." : "Publikasikan Laporan"}
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup Dialog Tambah Laporan"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <span className="sr-only">Tutup Dialog Tambah Laporan</span>
              <IconX size={20} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}