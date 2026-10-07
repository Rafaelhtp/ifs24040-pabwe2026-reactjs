import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import { asyncChangeLostFound } from "../states/action";

vi.mock("../states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, asyncChangeLostFound: vi.fn() };
});

const item = {
  id: 12,
  title: "Dompet Kulit",
  description: "Hilang di kantin",
  status: "found",
  is_completed: 0,
};

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncChangeLostFound.mockImplementation(() => () => Promise.resolve(true));
  });

  it("should render nothing when closed", () => {
    renderWithProviders(<ChangeModal isOpen={false} onClose={() => {}} item={item} />);

    expect(screen.queryByText("Ubah Data Laporan")).not.toBeInTheDocument();
  });

  it("should render nothing when item is missing", () => {
    renderWithProviders(<ChangeModal isOpen onClose={() => {}} item={null} />);

    expect(screen.queryByText("Ubah Data Laporan")).not.toBeInTheDocument();
  });

  it("should prefill form with item data", () => {
    renderWithProviders(<ChangeModal isOpen onClose={() => {}} item={item} />);

    expect(screen.getByDisplayValue("Dompet Kulit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hilang di kantin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Barang Ditemukan/ })).toHaveClass(
      "border-emerald-500"
    );
    expect(screen.getByLabelText(/Tandai kasus telah selesai/)).not.toBeChecked();
  });

  it("should use defaults when item fields are empty", () => {
    renderWithProviders(
      <ChangeModal isOpen onClose={() => {}} item={{ id: 1 }} />
    );

    expect(screen.getByRole("button", { name: /Barang Hilang/ })).toHaveClass("border-rose-500");
    expect(screen.getByLabelText(/Tandai kasus telah selesai/)).not.toBeChecked();
  });

  it("should check completed toggle for completed item", () => {
    renderWithProviders(
      <ChangeModal isOpen onClose={() => {}} item={{ ...item, is_completed: 1 }} />
    );

    expect(screen.getByLabelText(/Tandai kasus telah selesai/)).toBeChecked();
  });

  it("should dispatch update with edited values", () => {
    renderWithProviders(<ChangeModal isOpen onClose={() => {}} item={item} />);

    fireEvent.change(screen.getByDisplayValue("Dompet Kulit"), {
      target: { value: "Dompet Coklat" },
    });
    fireEvent.change(screen.getByDisplayValue("Hilang di kantin"), {
      target: { value: "Sudah ditemukan" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Barang Hilang/ }));
    fireEvent.click(screen.getByLabelText(/Tandai kasus telah selesai/));
    fireEvent.click(screen.getByRole("button", { name: "Perbarui Laporan" }));

    expect(asyncChangeLostFound).toHaveBeenCalledWith(12, {
      title: "Dompet Coklat",
      description: "Sudah ditemukan",
      status: "lost",
      is_completed: 1,
    });
  });

  it("should send is_completed 0 when toggle is unchecked and allow switching to found", () => {
    renderWithProviders(
      <ChangeModal isOpen onClose={() => {}} item={{ ...item, status: "lost" }} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Barang Ditemukan/ }));
    fireEvent.click(screen.getByRole("button", { name: "Perbarui Laporan" }));

    expect(asyncChangeLostFound).toHaveBeenCalledWith(
      12,
      expect.objectContaining({ status: "found", is_completed: 0 })
    );
  });

  it("should not dispatch when fields only contain spaces", () => {
    const { container } = renderWithProviders(
      <ChangeModal isOpen onClose={() => {}} item={item} />
    );

    fireEvent.change(screen.getByDisplayValue("Dompet Kulit"), { target: { value: "  " } });
    fireEvent.submit(container.querySelector("form"));

    expect(asyncChangeLostFound).not.toHaveBeenCalled();
  });

  it("should disable submit while saving", () => {
    renderWithProviders(<ChangeModal isOpen onClose={() => {}} item={item} />, {
      preloadedState: { isLostFoundChange: true },
    });

    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });

  it("should call onClose from cancel and close buttons", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal isOpen onClose={onClose} item={item} />);

    fireEvent.click(screen.getByRole("button", { name: "Batal Ubah Laporan" }));
    screen
      .getAllByRole("button", { name: "Tutup Dialog Edit Laporan" })
      .forEach((button) => fireEvent.click(button));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("should reset flag and call callbacks after update succeeds", () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const { store } = renderWithProviders(
      <ChangeModal isOpen onClose={onClose} item={item} onSuccess={onSuccess} />,
      { preloadedState: { isLostFoundChanged: true } }
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(store.getState().isLostFoundChanged).toBe(false);
  });

  it("should work without onSuccess callback", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal isOpen onClose={onClose} item={item} />, {
      preloadedState: { isLostFoundChanged: true },
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
