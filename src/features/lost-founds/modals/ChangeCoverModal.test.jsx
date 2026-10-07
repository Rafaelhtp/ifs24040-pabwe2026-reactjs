import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";
import { asyncChangeLostFoundCover } from "../states/action";
import { showWarningDialog } from "../../../helpers/toolsHelper";

vi.mock("../states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, asyncChangeLostFoundCover: vi.fn() };
});

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, showWarningDialog: vi.fn() };
});

const imageFile = () => new File(["img"], "cover.png", { type: "image/png" });
const getFileInput = (container) => container.querySelector('input[type="file"]');

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncChangeLostFoundCover.mockImplementation(() => () => Promise.resolve(true));
    URL.createObjectURL = vi.fn(() => "blob:preview-url");
  });

  it("should render nothing when closed", () => {
    renderWithProviders(<ChangeCoverModal isOpen={false} onClose={() => {}} itemId="7" />);

    expect(screen.queryByText("Unggah Foto Cover")).not.toBeInTheDocument();
  });

  it("should render empty dropzone with disabled upload button", () => {
    renderWithProviders(<ChangeCoverModal isOpen onClose={() => {}} itemId="7" />);

    expect(screen.getByText("Klik untuk memilih gambar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unggah Sekarang/ })).toBeDisabled();
  });

  it("should reject non-image files with warning", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen onClose={() => {}} itemId="7" />
    );
    const file = new File(["doc"], "a.pdf", { type: "application/pdf" });

    fireEvent.change(getFileInput(container), { target: { files: [file] } });

    expect(showWarningDialog).toHaveBeenCalledWith("File harus berupa gambar!");
    expect(screen.queryByAltText("Preview Cover")).not.toBeInTheDocument();
  });

  it("should do nothing when file selection is cancelled", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen onClose={() => {}} itemId="7" />
    );

    fireEvent.change(getFileInput(container), { target: { files: [] } });

    expect(showWarningDialog).not.toHaveBeenCalled();
    expect(screen.getByText("Klik untuk memilih gambar")).toBeInTheDocument();
  });

  it("should show preview and upload selected image", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen onClose={() => {}} itemId="7" />
    );
    const file = imageFile();

    fireEvent.change(getFileInput(container), { target: { files: [file] } });

    expect(screen.getByAltText("Preview Cover")).toHaveAttribute("src", "blob:preview-url");
    const uploadButton = screen.getByRole("button", { name: /Unggah Sekarang/ });
    expect(uploadButton).toBeEnabled();

    fireEvent.click(uploadButton);

    expect(asyncChangeLostFoundCover).toHaveBeenCalledWith("7", file);
  });

  it("should warn when form is submitted without file", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen onClose={() => {}} itemId="7" />
    );

    fireEvent.submit(container.querySelector("form"));

    expect(showWarningDialog).toHaveBeenCalledWith(
      "Silakan pilih berkas gambar terlebih dahulu!"
    );
    expect(asyncChangeLostFoundCover).not.toHaveBeenCalled();
  });

  it("should show progress text and disable upload while uploading", () => {
    renderWithProviders(<ChangeCoverModal isOpen onClose={() => {}} itemId="7" />, {
      preloadedState: { isLostFoundChangeCover: true },
    });

    expect(screen.getByRole("button", { name: /Mengunggah/ })).toBeDisabled();
  });

  it("should call onClose from cancel and close buttons", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal isOpen onClose={onClose} itemId="7" />);

    fireEvent.click(screen.getByRole("button", { name: "Batal Unggah Foto Cover" }));
    fireEvent.click(screen.getByRole("button", { name: "Tutup Dialog Unggah Foto Cover" }));
    fireEvent.click(screen.getByRole("button", { name: "Tutup Dialog Ubah Cover" }));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("should reset flag and call callbacks after cover is changed", () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const { store } = renderWithProviders(
      <ChangeCoverModal isOpen onClose={onClose} itemId="7" onSuccess={onSuccess} />,
      { preloadedState: { isLostFoundChangedCover: true } }
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(store.getState().isLostFoundChangedCover).toBe(false);
  });

  it("should work without onSuccess callback", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal isOpen onClose={onClose} itemId="7" />, {
      preloadedState: { isLostFoundChangedCover: true },
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
