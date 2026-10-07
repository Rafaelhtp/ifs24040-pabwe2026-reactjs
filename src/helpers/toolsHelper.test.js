import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import {
  showErrorDialog,
  showWarningDialog,
  showSuccessDialog,
  showConfirmDialog,
  formatDate,
  getImageUrl,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
    close: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  it("should call Swal.fire for showErrorDialog and handle confirmation", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showErrorDialog("Error test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Terjadi Kesalahan",
        text: "Error test",
        icon: "error",
      })
    );
    expect(Swal.close).toHaveBeenCalled();

    // Not confirmed branch
    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showErrorDialog("Error test");
  });

  it("should call Swal.fire for showWarningDialog and handle confirmation", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showWarningDialog("Warning test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Peringatan",
        text: "Warning test",
        icon: "warning",
      })
    );
    expect(Swal.close).toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showWarningDialog("Warning test");
  });

  it("should call Swal.fire for showSuccessDialog and handle confirmation", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showSuccessDialog("Success test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Tindakan Berhasil",
        text: "Success test",
        icon: "success",
      })
    );
    expect(Swal.close).toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showSuccessDialog("Success test");
  });

  it("should call Swal.fire for showConfirmDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    const res = await showConfirmDialog("Confirm test?");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Konfirmasi",
        text: "Confirm test?",
        icon: "question",
      })
    );
    expect(res.isConfirmed).toBe(true);
  });

  it("should format date correctly or return fallback for empty date", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    const formatted = formatDate("2024-02-26T02:34:26.000000Z");
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe("string");
  });

  it("should run onConfirmed callback only when confirmed", async () => {
    const onConfirmed = vi.fn();

    Swal.fire.mockResolvedValue({ isConfirmed: false });
    await showConfirmDialog("Yakin?", onConfirmed);
    expect(onConfirmed).not.toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showConfirmDialog("Yakin?", onConfirmed);
    expect(onConfirmed).toHaveBeenCalledTimes(1);

    // Callback bukan function tidak boleh menyebabkan error
    await expect(showConfirmDialog("Yakin?", "bukan-function")).resolves.toEqual({
      isConfirmed: true,
    });
  });

  it("should return fallback for invalid date string", () => {
    expect(formatDate("bukan-tanggal")).toBe("-");
  });

  describe("getImageUrl", () => {
    it("should return null for empty path", () => {
      expect(getImageUrl(null)).toBeNull();
      expect(getImageUrl("")).toBeNull();
      expect(getImageUrl(undefined)).toBeNull();
    });

    it("should return absolute, blob, and data urls unchanged", () => {
      expect(getImageUrl("https://example.com/a.png")).toBe("https://example.com/a.png");
      expect(getImageUrl("http://example.com/a.png")).toBe("http://example.com/a.png");
      expect(getImageUrl("blob:http://localhost/abc")).toBe("blob:http://localhost/abc");
      expect(getImageUrl("data:image/png;base64,AAA")).toBe("data:image/png;base64,AAA");
    });

    it("should prefix relative path with api origin and strip leading slashes", () => {
      const relative = getImageUrl("uploads/a.png");
      const leading = getImageUrl("///uploads/a.png");

      expect(relative.startsWith("http")).toBe(true);
      expect(relative.endsWith("/uploads/a.png")).toBe(true);
      expect(leading).toBe(relative);
    });
  });
});
