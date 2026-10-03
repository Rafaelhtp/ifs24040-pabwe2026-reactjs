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
} from "@tabler/icons-react";

export default function HomePage() {
  const dispatch = useDispatch();

  // Redux Selectors
  const lostFounds = useSelector((state) => state.lostFounds || []);
  const isLostFound = useSelector((state) => state.isLostFound);
  const lostFoundStats = useSelector((state) => state.lostFoundStats);

  // Local States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "" (semua), "lost", "found"
  const [filterMe, setFilterMe] = useState(""); // "" atau "1"

  useEffect(() => {
    dispatch(asyncGetLostFounds({ status: filterStatus, is_me: filterMe }));
    dispatch(asyncGetLostFoundStats());
  }, [dispatch, filterStatus, filterMe]);

  // Filter pencarian live berdasarkan judul atau deskripsi
  const filteredList = lostFounds.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Aksi Tambah */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Pusat Laporan Lost & Found
          </h1>
          <p className="text-sm text-slate-500">
            Temukan barang hilang atau bantu laporkan barang temuan di sekitar kampus.
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

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">TOTAL LAPORAN</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {lostFounds.length}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-xs">
          <p className="text-xs font-semibold text-rose-500">BARANG HILANG</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {lostFounds.filter((item) => item.status === "lost").length}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600">DITEMUKAN</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {lostFounds.filter((item) => item.status === "found").length}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-xs">
          <p className="text-xs font-semibold text-blue-600">SELESAI</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {lostFounds.filter((item) => item.is_completed).length}
          </p>
        </div>
      </div>

      {/* Bar Pencarian & Filter Status */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <IconSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari berdasarkan nama barang, ciri-ciri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterMe("");
            }}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterStatus === "" && filterMe === ""
                ? "bg-slate-800 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("lost")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterStatus === "lost"
                ? "bg-rose-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Hilang
          </button>
          <button
            onClick={() => setFilterStatus("found")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterStatus === "found"
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Ditemukan
          </button>
          <button
            onClick={() => setFilterMe(filterMe === "1" ? "" : "1")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              filterMe === "1"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Laporan Saya
          </button>
        </div>
      </div>

      {/* Grid Kartu Laporan */}
      {isLostFound ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center text-sm font-semibold text-slate-400 animate-pulse">
            Memuat daftar laporan...
          </div>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <IconPackage size={48} className="text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">Tidak ada laporan ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau buat laporan baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredList.map((item) => (
            <Link
              key={item.id}
              to={`/lost-founds/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Cover Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <IconPackage size={40} />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute left-3 top-3 flex gap-2">
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
                  <span className="font-medium text-slate-600">
                    {item.user?.name || "Pelapor"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal Buat Laporan */}
      <AddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          dispatch(asyncGetLostFounds({ status: filterStatus, is_me: filterMe }));
        }}
      />
    </div>
  );
}