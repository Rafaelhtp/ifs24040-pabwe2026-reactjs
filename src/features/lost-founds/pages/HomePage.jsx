import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetLostFounds,
  asyncGetLostFoundStats,
} from "../states/action";
import { formatDate } from "../../../helpers/toolsHelper";
import AddModal from "../modals/AddModal";
import {
  IconPlus,
  IconSearch,
  IconClock,
  IconPackage,
  IconCheck,
  IconFilter,
} from "@tabler/icons-react";

export default function HomePage() {
  const dispatch = useDispatch();

  const lostFounds = useSelector((state) => state.lostFounds || []);
  const isLostFound = useSelector((state) => state.isLostFound);
  const lostFoundStats = useSelector((state) => state.lostFoundStats);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "", "lost", "found"
  const [filterCompleted, setFilterCompleted] = useState(""); // "", "1", "0"
  const [filterMe, setFilterMe] = useState(""); // "", "1"

  useEffect(() => {
    dispatch(
      asyncGetLostFounds({
        status: filterStatus,
        is_completed: filterCompleted,
        is_me: filterMe,
      })
    );
    dispatch(asyncGetLostFoundStats());
  }, [dispatch, filterStatus, filterCompleted, filterMe]);

  const filteredList = lostFounds.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Pusat Laporan Lost & Found
          </h1>
          <p className="text-sm text-slate-500">
            Temukan barang hilang atau laporkan barang temuan di sekitar kampus Delcom.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700"
        >
          <IconPlus size={18} />
          Buat Laporan Baru
        </button>
      </div>

      {/* Ringkasan Metrik Statistik */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Laporan
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {lostFounds.length}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">
            Barang Hilang
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {lostFounds.filter((item) => item.status === "lost").length}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Ditemukan
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {lostFounds.filter((item) => item.status === "found").length}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Kasus Selesai
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {lostFounds.filter((item) => item.is_completed).length}
          </p>
        </div>
      </div>

      {/* Bar Pencarian & Filter Status Terintegrasi */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative">
          <IconSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari berdasarkan judul barang, ciri-ciri, atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filter Tombol */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-slate-400">
            <IconFilter size={14} /> Filter:
          </span>

          <button
            onClick={() => {
              setFilterStatus("");
              setFilterCompleted("");
              setFilterMe("");
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filterStatus === "" && filterCompleted === "" && filterMe === ""
                ? "bg-slate-800 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Semua Laporan
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === "lost" ? "" : "lost")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filterStatus === "lost"
                ? "bg-rose-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            🔴 Hilang (Lost)
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === "found" ? "" : "found")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filterStatus === "found"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            🟢 Ditemukan (Found)
          </button>

          <button
            onClick={() => setFilterCompleted(filterCompleted === "1" ? "" : "1")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filterCompleted === "1"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            ✓ Sudah Selesai
          </button>

          <button
            onClick={() => setFilterMe(filterMe === "1" ? "" : "1")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              filterMe === "1"
                ? "bg-purple-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            👤 Laporan Saya (is_me)
          </button>
        </div>
      </div>

      {/* Grid Kartu Laporan */}
      {isLostFound ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm font-semibold text-slate-400 animate-pulse">
            Memuat daftar laporan...
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <IconPackage size={48} className="text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">Tidak ada laporan yang sesuai</p>
          <p className="text-xs text-slate-400 mt-1">Coba atur ulang filter pencarian atau buat laporan baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((item) => (
            <Link
              key={item.id}
              to={`/lost-founds/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Cover Gambar */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
                    <IconPackage size={40} />
                    <span className="text-[11px] font-medium text-slate-400 mt-1">
                      Tanpa Foto Cover
                    </span>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-xs ${
                      item.status === "lost" ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  >
                    {item.status === "lost" ? "HILANG" : "DITEMUKAN"}
                  </span>
                  {item.is_completed ? (
                    <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                      SELESAI
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Detail Konten */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 font-bold text-slate-800 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 flex-1">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <IconClock size={14} />
                    {formatDate ? formatDate(item.created_at) : item.created_at?.slice(0, 10)}
                  </span>
                  <span className="font-semibold text-slate-600">
                    {item.user?.name || "Pelapor"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal Tambah Laporan */}
      <AddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          dispatch(
            asyncGetLostFounds({
              status: filterStatus,
              is_completed: filterCompleted,
              is_me: filterMe,
            })
          );
        }}
      />
    </div>
  );
}