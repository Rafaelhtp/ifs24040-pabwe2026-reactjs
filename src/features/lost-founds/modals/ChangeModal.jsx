import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncChangeLostFound,
  setIsLostFoundChangedActionCreator,
} from "../states/action";
import { IconX, IconCheck } from "@tabler/icons-react";

export default function ChangeModal({ isOpen, onClose, item, onSuccess }) {
  const dispatch = useDispatch();
  const isLostFoundChange = useSelector((state) => state.isLostFoundChange);
  const isLostFoundChanged = useSelector((state) => state.isLostFoundChanged);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("lost");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setStatus(item.status || "lost");
      setIsCompleted(Boolean(item.is_completed));
    }
  }, [item]);

  useEffect(() => {
    if (isLostFoundChanged) {
      dispatch(setIsLostFoundChangedActionCreator(false));
      if (onSuccess) onSuccess();
      onClose();
    }
  }, [isLostFoundChanged, dispatch, onClose, onSuccess]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    dispatch(
      asyncChangeLostFound(item.id, {
        title,
        description,
        status,
        is_completed: isCompleted ? 1 : 0,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">Ubah Data Laporan</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Dialog Edit Laporan"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <IconX size={20} aria-hidden="true" />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Toggle Selesai */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50">
            <input
              type="checkbox"
              id="is_completed_toggle"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_completed_toggle" className="text-sm font-medium text-slate-700 select-none">
              Tandai kasus telah selesai / barang sudah kembali
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Batal Ubah Laporan"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLostFoundChange}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-50"
            >
              <IconCheck size={18} />
              {isLostFoundChange ? "Menyimpan..." : "Perbarui Laporan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Dialog Edit Laporan"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <span className="sr-only">Tutup Dialog Edit Laporan</span>
              <IconX size={20} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}