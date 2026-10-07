import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetLostFoundById, asyncDeleteLostFound } from "../states/action";
import { showConfirmDialog } from "../../../helpers/toolsHelper";

vi.mock("../states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetLostFoundById: vi.fn(),
    asyncDeleteLostFound: vi.fn(),
  };
});

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, showConfirmDialog: vi.fn() };
});

const report = {
  id: 5,
  user_id: 1,
  title: "Kunci Motor",
  description: "Gantungan merah\nHonda Vario",
  status: "lost",
  is_completed: 0,
  cover: "https://example.com/kunci.png",
  created_at: "2026-10-01T02:00:00.000000Z",
  user: { name: "Budi" },
};

function renderDetail(preloadedState = {}) {
  return renderWithProviders(
    <Routes>
      <Route path="/lost-founds/:id" element={<DetailPage />} />
      <Route path="/" element={<div>Home Stub</div>} />
    </Routes>,
    { route: "/lost-founds/5", preloadedState }
  );
}

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncSetLostFoundById.mockImplementation(() => () => Promise.resolve());
    asyncDeleteLostFound.mockImplementation(() => () => Promise.resolve(true));
    showConfirmDialog.mockImplementation((_message, onConfirmed) => {
      onConfirmed?.();
      return Promise.resolve({ isConfirmed: true });
    });
  });

  it("should request report detail by route id", () => {
    renderDetail();

    expect(asyncSetLostFoundById).toHaveBeenCalledWith("5");
  });

  it("should show loading text when report is not available yet", () => {
    renderDetail({ lostFound: null });

    expect(screen.getByText("Memuat rincian laporan...")).toBeInTheDocument();
  });

  it("should show loading text while request is running", () => {
    renderDetail({ lostFound: report, isLostFound: true });

    expect(screen.getByText("Memuat rincian laporan...")).toBeInTheDocument();
    expect(screen.queryByText("Kunci Motor")).not.toBeInTheDocument();
  });

  it("should render report detail for a visitor (not owner)", () => {
    renderDetail({ lostFound: report, profile: { id: 99 } });

    expect(screen.getByRole("heading", { name: "Kunci Motor" })).toBeInTheDocument();
    expect(screen.getByAltText("Kunci Motor")).toHaveAttribute(
      "src",
      "https://example.com/kunci.png"
    );
    expect(screen.getByText("🔴 BARANG HILANG")).toBeInTheDocument();
    expect(screen.getByText(/DALAM PROSES/)).toBeInTheDocument();
    expect(screen.getByText(/Dilaporkan oleh: Budi/)).toBeInTheDocument();
    expect(screen.getByText(/Gantungan merah/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Kembali ke Daftar Laporan/ })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.queryByText("Edit Informasi Laporan")).not.toBeInTheDocument();
    expect(screen.queryByText("Hapus Laporan")).not.toBeInTheDocument();
    expect(screen.queryByText("Ubah Cover")).not.toBeInTheDocument();
  });

  it("should render found and completed report without cover and reporter name", () => {
    renderDetail({
      lostFound: { ...report, status: "found", is_completed: 1, cover: null, user: null },
      profile: { id: 99 },
    });

    expect(screen.getByText("🟢 BARANG DITEMUKAN")).toBeInTheDocument();
    expect(screen.getByText(/KASUS SELESAI/)).toBeInTheDocument();
    expect(screen.getByText("Belum ada foto cover")).toBeInTheDocument();
    expect(screen.getByText(/Dilaporkan oleh: Pengguna/)).toBeInTheDocument();
  });

  it("should show owner actions when report belongs to current user", () => {
    renderDetail({ lostFound: report, profile: { id: 1 } });

    expect(screen.getByText("Edit Informasi Laporan")).toBeInTheDocument();
    expect(screen.getByText("Hapus Laporan")).toBeInTheDocument();
    expect(screen.getByText("Ubah Cover")).toBeInTheDocument();
  });

  it("should open and close edit modal", () => {
    renderDetail({ lostFound: report, profile: { id: 1 } });

    expect(screen.queryByText("Ubah Data Laporan")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit Informasi Laporan"));
    expect(screen.getByText("Ubah Data Laporan")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Batal Ubah Laporan" }));
    expect(screen.queryByText("Ubah Data Laporan")).not.toBeInTheDocument();
  });

  it("should open and close cover modal", () => {
    renderDetail({ lostFound: report, profile: { id: 1 } });

    expect(screen.queryByText("Unggah Foto Cover")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Ubah Cover"));
    expect(screen.getByText("Unggah Foto Cover")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Batal Unggah Foto Cover" }));
    expect(screen.queryByText("Unggah Foto Cover")).not.toBeInTheDocument();
  });

  it("should reload detail after edit succeeds", () => {
    renderDetail({
      lostFound: report,
      profile: { id: 1 },
      isLostFoundChanged: true,
    });

    // 1x saat mount + 1x dari onSuccess ChangeModal
    expect(asyncSetLostFoundById.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("should reload detail after cover upload succeeds", () => {
    renderDetail({
      lostFound: report,
      profile: { id: 1 },
      isLostFoundChangedCover: true,
    });

    expect(asyncSetLostFoundById.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("should delete report after confirmation", () => {
    renderDetail({ lostFound: report, profile: { id: 1 } });

    fireEvent.click(screen.getByText("Hapus Laporan"));

    expect(showConfirmDialog).toHaveBeenCalledWith(
      "Apakah kamu yakin ingin menghapus laporan ini?",
      expect.any(Function)
    );
    expect(asyncDeleteLostFound).toHaveBeenCalledWith("5");
  });

  it("should not delete report when confirmation is cancelled", () => {
    showConfirmDialog.mockImplementation(() => Promise.resolve({ isConfirmed: false }));
    renderDetail({ lostFound: report, profile: { id: 1 } });

    fireEvent.click(screen.getByText("Hapus Laporan"));

    expect(asyncDeleteLostFound).not.toHaveBeenCalled();
  });

  it("should navigate home and reset flag after report is deleted", () => {
    const { store } = renderDetail({
      lostFound: report,
      profile: { id: 1 },
      isLostFoundDeleted: true,
    });

    expect(screen.getByText("Home Stub")).toBeInTheDocument();
    expect(store.getState().isLostFoundDeleted).toBe(false);
  });
});
