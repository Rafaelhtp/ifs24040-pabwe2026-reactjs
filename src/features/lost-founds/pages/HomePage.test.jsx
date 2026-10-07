import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetLostFounds, asyncSetLostFoundStats } from "../states/action";

vi.mock("../states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetLostFounds: vi.fn(),
    asyncSetLostFoundStats: vi.fn(),
  };
});

const reports = [
  {
    id: 1,
    title: "Kunci Motor",
    description: "Gantungan merah",
    status: "lost",
    is_completed: 0,
    cover: "https://example.com/kunci.png",
    created_at: "2026-10-01T02:00:00.000000Z",
    user: { name: "Budi" },
  },
  {
    id: 2,
    title: "Dompet Kulit",
    description: "Ditemukan di kantin",
    status: "found",
    is_completed: 1,
    cover: null,
    created_at: "2026-10-02T02:00:00.000000Z",
    user: null,
  },
  {
    id: 3,
    title: null,
    description: null,
    status: "lost",
    is_completed: 0,
    created_at: null,
  },
];

function lastFilters() {
  const calls = asyncSetLostFounds.mock.calls;
  return calls[calls.length - 1][0];
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncSetLostFounds.mockImplementation(() => () => Promise.resolve());
    asyncSetLostFoundStats.mockImplementation(() => () => Promise.resolve(true));
  });

  it("should load reports and stats on mount with empty filters", () => {
    renderWithProviders(<HomePage />);

    expect(asyncSetLostFounds).toHaveBeenCalledWith({
      status: "",
      is_completed: "",
      is_me: "",
    });
    expect(asyncSetLostFoundStats).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("heading", { name: /Pusat Laporan Lost/ })).toBeInTheDocument();
  });

  it("should render report cards with badges and fallbacks", () => {
    renderWithProviders(<HomePage />, { preloadedState: { lostFounds: reports } });

    expect(screen.getByText("Kunci Motor")).toBeInTheDocument();
    expect(screen.getByText("Dompet Kulit")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    // Laporan tanpa data pelapor memakai nama fallback
    expect(screen.getByText("Pelapor")).toBeInTheDocument();
    expect(screen.getByText("Tanpa Foto Cover", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("SELESAI")).toBeInTheDocument();
    expect(screen.getByText("HILANG")).toBeInTheDocument();
    expect(screen.getByText("DITEMUKAN")).toBeInTheDocument();
    // Laporan ke-3 tidak punya judul/deskripsi sehingga tidak lolos filter pencarian
    expect(screen.getAllByRole("link").length).toBe(2);
    expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "/lost-founds/1");
  });

  it("should show summary counters", () => {
    renderWithProviders(<HomePage />, { preloadedState: { lostFounds: reports } });

    // Label "Ditemukan" juga dipakai tombol filter, jadi ambil elemen <p> saja
    const counter = (label) =>
      screen.getAllByText(label).find((el) => el.tagName === "P").nextElementSibling.textContent;
    expect(counter("Total Laporan")).toBe("3");
    expect(counter("Barang Hilang")).toBe("2");
    expect(counter("Ditemukan")).toBe("1");
    expect(counter("Kasus Selesai")).toBe("1");
  });

  it("should filter reports by search term in title or description", () => {
    renderWithProviders(<HomePage />, { preloadedState: { lostFounds: reports } });
    const input = screen.getByLabelText("Cari barang hilang atau temuan");

    fireEvent.change(input, { target: { value: "kunci" } });
    expect(screen.getByText("Kunci Motor")).toBeInTheDocument();
    expect(screen.queryByText("Dompet Kulit")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "KANTIN" } });
    expect(screen.getByText("Dompet Kulit")).toBeInTheDocument();
    expect(screen.queryByText("Kunci Motor")).not.toBeInTheDocument();
  });

  it("should show empty state when nothing matches", () => {
    renderWithProviders(<HomePage />, { preloadedState: { lostFounds: reports } });

    fireEvent.change(screen.getByLabelText("Cari barang hilang atau temuan"), {
      target: { value: "tidak-ada-barang-ini" },
    });

    expect(screen.getByText("Tidak ada laporan yang sesuai")).toBeInTheDocument();
  });

  it("should show empty state when store has no reports", () => {
    renderWithProviders(<HomePage />, { preloadedState: { lostFounds: [] } });

    expect(screen.getByText("Tidak ada laporan yang sesuai")).toBeInTheDocument();
  });

  it("should fall back to empty list when store value is null", () => {
    renderWithProviders(<HomePage />, { preloadedState: { lostFounds: null } });

    expect(screen.getByText("Tidak ada laporan yang sesuai")).toBeInTheDocument();
  });

  it("should show loading text while fetching", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: { lostFounds: reports, isLostFound: true },
    });

    expect(screen.getByText("Memuat rincian laporan...")).toBeInTheDocument();
    expect(screen.queryByText("Kunci Motor")).not.toBeInTheDocument();
  });

  it("should toggle lost status filter", () => {
    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Hilang" }));
    expect(lastFilters()).toEqual({ status: "lost", is_completed: "", is_me: "" });

    fireEvent.click(screen.getByRole("button", { name: "Hilang" }));
    expect(lastFilters()).toEqual({ status: "", is_completed: "", is_me: "" });
  });

  it("should toggle found status filter", () => {
    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Ditemukan" }));
    expect(lastFilters().status).toBe("found");

    fireEvent.click(screen.getByRole("button", { name: "Ditemukan" }));
    expect(lastFilters().status).toBe("");
  });

  it("should toggle completed filter", () => {
    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Selesai" }));
    expect(lastFilters().is_completed).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: "Selesai" }));
    expect(lastFilters().is_completed).toBe("");
  });

  it("should toggle my reports filter", () => {
    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Laporan Saya" }));
    expect(lastFilters().is_me).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: "Laporan Saya" }));
    expect(lastFilters().is_me).toBe("");
  });

  it("should reset every filter with 'Semua' button", () => {
    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByRole("button", { name: "Hilang" }));
    fireEvent.click(screen.getByRole("button", { name: "Selesai" }));
    fireEvent.click(screen.getByRole("button", { name: "Laporan Saya" }));
    expect(lastFilters()).toEqual({ status: "lost", is_completed: "1", is_me: "1" });

    fireEvent.click(screen.getByRole("button", { name: "Semua" }));
    expect(lastFilters()).toEqual({ status: "", is_completed: "", is_me: "" });
  });

  it("should open and close add report modal", () => {
    renderWithProviders(<HomePage />);

    expect(screen.queryByText("Tambah Laporan Baru")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Buat Laporan Baru/ }));
    expect(screen.getByText("Tambah Laporan Baru")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Batal Tambah Laporan" }));
    expect(screen.queryByText("Tambah Laporan Baru")).not.toBeInTheDocument();
  });

  it("should reload reports with current filters after a report is added", () => {
    renderWithProviders(<HomePage />, { preloadedState: { isLostFoundAdded: true } });

    // 1x saat mount + 1x dari onSuccess AddModal
    expect(asyncSetLostFounds.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(lastFilters()).toEqual({ status: "", is_completed: "", is_me: "" });
  });
});
