import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetLostFounds,
  asyncSetLostFoundStats,
} from "../states/action";
import { formatDate } from "../../../helpers/toolsHelper";
import AddModal from "../modals/AddModal";
import {
  IconPlus,
  IconSearch,
  IconClock,
  IconPackage,
  IconFilter,
} from "@tabler/icons-react";

export default function HomePage() {
  const dispatch = useDispatch();

  const lostFounds = useSelector((state) => state.lostFounds || []);
  const isLostFound = useSelector((state) => state.isLostFound);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCompleted, setFilterCompleted] = useState("");
  const [filterMe, setFilterMe] = useState("");

  useEffect(() => {
    dispatch(
      asyncSetLostFounds({
        status: filterStatus,
        is_completed: filterCompleted,
        is_me: filterMe,
      })
    );
    dispatch(asyncSetLostFoundStats());
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pusat Laporan Lost &amp; Found
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Temukan barang hilang atau laporkan barang temuan di sekitar kampus Delcom.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-800"
        >
          <IconPlus size={18} />
          Buat Laporan Baru
        </button>
      </div>

      {/* Ringkasan Metrik Statistik (Warna disesuaikan agar kontras > 4.5:1) */}
      <div id="statistik" tabIndex="-1" className="grid grid-cols-2 gap-4 lg:grid-cols-4 outline-none">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Total Laporan
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {lostFounds.length}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-800">
            Barang Hilang
          </p>
          <p className="mt-2 text-2xl font-extrabold text-rose-800">
            {lostFounds.filter((item) => item.status === "lost").length}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Ditemukan
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-800">
            {lostFounds.filter((item) => item.status === "found").length}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Kasus Selesai
          </p>
          <p className="mt-2 text-2xl font-extrabold text-blue-800">
            {lostFounds.filter((item) => item.is_completed).length}
          </p>
        </div>
      </div>

      {/* Bar Pencarian & Filter */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative">
          <IconSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="text"
            placeholder="Cari berdasarkan judul barang, ciri-ciri..."
            aria-label="Cari barang hilang atau temuan"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="mr-1 flex items-center gap-1 text-xs font-bold text-slate-700">
            <IconFilter size={14} /> Filter:
          </span>

          <button
            onClick={() => {
              setFilterStatus("");
              setFilterCompleted("");
              setFilterMe("");
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filterStatus === "" && filterCompleted === "" && filterMe === ""
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Semua
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === "lost" ? "" : "lost")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filterStatus === "lost"
                ? "bg-rose-700 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Hilang
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === "found" ? "" : "found")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filterStatus === "found"
                ? "bg-emerald-700 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Ditemukan
          </button>

          <button
            onClick={() => setFilterCompleted(filterCompleted === "1" ? "" : "1")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filterCompleted === "1"
                ? "bg-blue-700 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Selesai
          </button>

          <button
            onClick={() => setFilterMe(filterMe === "1" ? "" : "1")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filterMe === "1"
                ? "bg-purple-700 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Laporan Saya
          </button>
        </div>
      </div>

      {/* Grid Kartu Laporan */}
      {isLostFound ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm font-bold text-slate-900">
            Memuat rincian laporan...
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <IconPackage size={48} className="text-slate-400 mb-3" />
          <p className="font-bold text-slate-800">Tidak ada laporan yang sesuai</p>
          <p className="text-xs text-slate-600 mt-1">Coba atur ulang filter pencarian atau buat laporan baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((item) => (
            <Link
              key={item.id}
              to={`/lost-founds/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Cover Gambar */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                    <IconPackage size={40} />
                    <span className="text-xs font-semibold text-slate-700 mt-1">
                      Tanpa Foto Cover
                    </span>
                  </div>
                )}
                {/* Badges dengan kontras tinggi (bg-rose-700 & bg-emerald-700) */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-xs ${
                      item.status === "lost" ? "bg-rose-700" : "bg-emerald-700"
                    }`}
                  >
                    {item.status === "lost" ? "HILANG" : "DITEMUKAN"}
                  </span>
                  {item.is_completed ? (
                    <span className="rounded-lg bg-blue-700 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                      SELESAI
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Detail Konten (h2 digunakan agar hierarki heading berurutan) */}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="line-clamp-1 font-bold text-slate-900 group-hover:text-blue-700 text-base">
                  {item.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-700 flex-1 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-700">
                  <span className="flex items-center gap-1 font-medium">
                    <IconClock size={14} className="text-slate-600" />
                    {formatDate ? formatDate(item.created_at) : item.created_at?.slice(0, 10)}
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.user?.name || "Pelapor"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          dispatch(
            asyncSetLostFounds({
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