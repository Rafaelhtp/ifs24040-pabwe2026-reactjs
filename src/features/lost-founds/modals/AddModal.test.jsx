import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import { asyncAddLostFound } from "../states/action";

vi.mock("../states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, asyncAddLostFound: vi.fn() };
});

const TITLE_PLACEHOLDER = /Contoh: Kunci Motor/;
const DESC_PLACEHOLDER = /Jelaskan ciri-ciri/;

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncAddLostFound.mockImplementation(() => () => Promise.resolve(true));
  });

  it("should render nothing when closed", () => {
    renderWithProviders(<AddModal isOpen={false} onClose={() => {}} />);

    expect(screen.queryByText("Tambah Laporan Baru")).not.toBeInTheDocument();
  });

  it("should render form when open", () => {
    renderWithProviders(<AddModal isOpen onClose={() => {}} />);

    expect(screen.getByText("Tambah Laporan Baru")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(TITLE_PLACEHOLDER)).toHaveValue("");
    expect(screen.getByRole("button", { name: "Publikasikan Laporan" })).toBeEnabled();
  });

  it("should switch status between lost and found", () => {
    renderWithProviders(<AddModal isOpen onClose={() => {}} />);
    const lost = screen.getByRole("button", { name: /Barang Hilang/ });
    const found = screen.getByRole("button", { name: /Barang Ditemukan/ });

    expect(lost).toHaveClass("border-rose-500");

    fireEvent.click(found);
    expect(found).toHaveClass("border-emerald-500");
    expect(lost).not.toHaveClass("border-rose-500");

    fireEvent.click(lost);
    expect(lost).toHaveClass("border-rose-500");
  });

  it("should dispatch create action with form values on submit", () => {
    renderWithProviders(<AddModal isOpen onClose={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText(TITLE_PLACEHOLDER), {
      target: { value: "Kunci Motor" },
    });
    fireEvent.change(screen.getByPlaceholderText(DESC_PLACEHOLDER), {
      target: { value: "Ada gantungan merah" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Barang Ditemukan/ }));
    fireEvent.click(screen.getByRole("button", { name: "Publikasikan Laporan" }));

    expect(asyncAddLostFound).toHaveBeenCalledWith({
      title: "Kunci Motor",
      description: "Ada gantungan merah",
      status: "found",
    });
  });

  it("should not dispatch when title or description only contains spaces", () => {
    const { container } = renderWithProviders(<AddModal isOpen onClose={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText(TITLE_PLACEHOLDER), { target: { value: "   " } });
    fireEvent.change(screen.getByPlaceholderText(DESC_PLACEHOLDER), { target: { value: "ok" } });
    fireEvent.submit(container.querySelector("form"));

    expect(asyncAddLostFound).not.toHaveBeenCalled();
  });

  it("should disable submit button and show progress text while saving", () => {
    renderWithProviders(<AddModal isOpen onClose={() => {}} />, {
      preloadedState: { isLostFoundAdd: true },
    });

    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });

  it("should call onClose from cancel and close buttons", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Batal Tambah Laporan" }));
    screen
      .getAllByRole("button", { name: "Tutup Dialog Tambah Laporan" })
      .forEach((button) => fireEvent.click(button));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("should reset flag, call onSuccess and onClose after report is added", () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const { store } = renderWithProviders(
      <AddModal isOpen onClose={onClose} onSuccess={onSuccess} />,
      { preloadedState: { isLostFoundAdded: true } }
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(store.getState().isLostFoundAdded).toBe(false);
  });

  it("should work without onSuccess callback", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal isOpen onClose={onClose} />, {
      preloadedState: { isLostFoundAdded: true },
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
