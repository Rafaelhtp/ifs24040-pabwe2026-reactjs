import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setLostFoundsActionCreator,
  setLostFoundActionCreator,
  setIsLostFoundActionCreator,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  setIsLostFoundDeleteActionCreator,
  setIsLostFoundDeletedActionCreator,
  setLostFoundStatsActionCreator,
  asyncGetLostFounds,
  asyncSetLostFounds,
  asyncGetLostFoundById,
  asyncSetLostFound,
  asyncSetLostFoundById,
  asyncCreateLostFound,
  asyncAddLostFound,
  asyncUpdateLostFound,
  asyncChangeLostFound,
  asyncUploadCoverLostFound,
  asyncChangeLostFoundCover,
  asyncChangeCoverLostFound,
  asyncDeleteLostFound,
  asyncGetLostFoundStats,
  asyncSetLostFoundStats,
} from "./action";
import { lostFoundApi } from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe("lost-founds action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("should create correct action objects", () => {
    expect(setLostFoundsActionCreator([1])).toEqual({
      type: ActionType.SET_LOST_FOUNDS,
      payload: [1],
    });
    expect(setLostFoundActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_LOST_FOUND,
      payload: { id: 1 },
    });
    expect(setIsLostFoundActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND,
      payload: true,
    });
    expect(setIsLostFoundAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_ADD,
      payload: true,
    });
    expect(setIsLostFoundAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_ADDED,
      payload: true,
    });
    expect(setIsLostFoundChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGE,
      payload: true,
    });
    expect(setIsLostFoundChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGED,
      payload: true,
    });
    expect(setIsLostFoundChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
      payload: true,
    });
    expect(setIsLostFoundChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
      payload: true,
    });
    expect(setIsLostFoundDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_DELETE,
      payload: true,
    });
    expect(setIsLostFoundDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_DELETED,
      payload: true,
    });
    expect(setLostFoundStatsActionCreator({ a: 1 })).toEqual({
      type: ActionType.SET_LOST_FOUND_STATS,
      payload: { a: 1 },
    });
  });

  it("should expose aliases for thunks", () => {
    expect(asyncSetLostFounds).toBe(asyncGetLostFounds);
    expect(asyncSetLostFound).toBe(asyncGetLostFoundById);
    expect(asyncSetLostFoundById).toBe(asyncGetLostFoundById);
    expect(asyncAddLostFound).toBe(asyncCreateLostFound);
    expect(asyncChangeLostFound).toBe(asyncUpdateLostFound);
    expect(asyncChangeLostFoundCover).toBe(asyncUploadCoverLostFound);
    expect(asyncChangeCoverLostFound).toBe(asyncUploadCoverLostFound);
    expect(asyncSetLostFoundStats).toBe(asyncGetLostFoundStats);
  });

  describe("asyncGetLostFounds", () => {
    it("should dispatch lost founds when response.success is true", async () => {
      const dispatch = vi.fn();
      const list = [{ id: 1 }];
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue({
        success: true,
        data: { lost_founds: list },
      });

      await asyncGetLostFounds({ status: "lost" })(dispatch);

      expect(lostFoundApi.getLostFounds).toHaveBeenCalledWith({ status: "lost" });
      expect(dispatch).toHaveBeenNthCalledWith(1, setIsLostFoundActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator(list));
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundActionCreator(false));
    });

    it("should dispatch empty array when status is success but data missing", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue({ status: "success" });

      await asyncGetLostFounds()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([]));
    });

    it("should accept response that only contains an array of lost_founds", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue({
        data: { lost_founds: [{ id: 3 }] },
      });

      await asyncGetLostFounds()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([{ id: 3 }]));
    });

    it("should show server message when response is a failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue({
        status: "fail",
        message: "Token salah",
      });

      await asyncGetLostFounds()(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Token salah");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundActionCreator(false));
    });

    it("should show fallback message when response is empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue(null);

      await asyncGetLostFounds()(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Gagal memuat data lost & found");
    });

    it("should show error dialog when request throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFounds").mockRejectedValue(new Error("Network"));

      await asyncGetLostFounds()(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Network");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundActionCreator(false));
    });
  });

  describe("asyncGetLostFoundById", () => {
    it("should dispatch lost found when success is true", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue({
        success: true,
        data: { lost_found: { id: 1 } },
      });

      await asyncGetLostFoundById(1)(dispatch);

      expect(lostFoundApi.getLostFoundById).toHaveBeenCalledWith(1);
      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 1 }));
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundActionCreator(false));
    });

    it("should dispatch lost found when status is success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue({
        status: "success",
        data: { lost_found: { id: 2 } },
      });

      await asyncGetLostFoundById(2)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 2 }));
    });

    it("should dispatch lost found when only data.lost_found exists", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue({
        data: { lost_found: { id: 3 } },
      });

      await asyncGetLostFoundById(3)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 3 }));
    });

    it("should show server message on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue({
        status: "fail",
        message: "Tidak ditemukan",
      });

      await asyncGetLostFoundById(9)(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Tidak ditemukan");
    });

    it("should show fallback message on empty response", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue(undefined);

      await asyncGetLostFoundById(9)(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Gagal memuat rincian laporan");
    });

    it("should show error dialog when request throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getLostFoundById").mockRejectedValue(new Error("Boom"));

      await asyncGetLostFoundById(9)(dispatch);

      expect(showErrorDialog).toHaveBeenCalledWith("Boom");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundActionCreator(false));
    });
  });

  describe("asyncCreateLostFound", () => {
    const payload = { title: "Dompet", description: "Hitam", status: "lost" };

    it("should return true and flag added on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "createLostFound").mockResolvedValue({ success: true });

      const result = await asyncCreateLostFound(payload)(dispatch);

      expect(result).toBe(true);
      expect(lostFoundApi.createLostFound).toHaveBeenCalledWith(payload);
      expect(showSuccessDialog).toHaveBeenCalledWith("Laporan berhasil ditambahkan!");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(true));
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundAddActionCreator(false));
    });

    it("should also accept status success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "createLostFound").mockResolvedValue({ status: "success" });

      expect(await asyncCreateLostFound(payload)(dispatch)).toBe(true);
    });

    it("should return false with server message on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "createLostFound").mockResolvedValue({
        status: "fail",
        message: "Judul wajib",
      });

      const result = await asyncCreateLostFound(payload)(dispatch);

      expect(result).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Judul wajib");
    });

    it("should return false with fallback message on empty response", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "createLostFound").mockResolvedValue(null);

      const result = await asyncCreateLostFound(payload)(dispatch);

      expect(result).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal menambahkan laporan");
    });

    it("should return false when request throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "createLostFound").mockRejectedValue(new Error("Down"));

      const result = await asyncCreateLostFound(payload)(dispatch);

      expect(result).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Down");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundAddActionCreator(false));
    });
  });

  describe("asyncUpdateLostFound", () => {
    const data = { title: "A", description: "B", status: "found", is_completed: 1 };

    it("should update store when response contains lost_found", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "updateLostFound").mockResolvedValue({
        success: true,
        data: { lost_found: { id: 1 } },
      });

      const result = await asyncUpdateLostFound(1, data)(dispatch);

      expect(result).toBe(true);
      expect(lostFoundApi.updateLostFound).toHaveBeenCalledWith(1, data);
      expect(showSuccessDialog).toHaveBeenCalledWith("Laporan berhasil diperbarui!");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 1 }));
    });

    it("should skip store update when response has no lost_found", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "updateLostFound").mockResolvedValue({ status: "success" });

      const result = await asyncUpdateLostFound(1, data)(dispatch);

      expect(result).toBe(true);
      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: ActionType.SET_LOST_FOUND })
      );
    });

    it("should return false with server message on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "updateLostFound").mockResolvedValue({
        status: "fail",
        message: "Ditolak",
      });

      expect(await asyncUpdateLostFound(1, data)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Ditolak");
    });

    it("should return false with fallback message on empty response", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "updateLostFound").mockResolvedValue(null);

      expect(await asyncUpdateLostFound(1, data)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal memperbarui laporan");
    });

    it("should return false when request throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "updateLostFound").mockRejectedValue(new Error("Err"));

      expect(await asyncUpdateLostFound(1, data)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Err");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundChangeActionCreator(false));
    });
  });

  describe("asyncUploadCoverLostFound", () => {
    const file = new File(["x"], "c.png", { type: "image/png" });

    it("should update store when response contains lost_found", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "uploadCover").mockResolvedValue({
        success: true,
        data: { lost_found: { id: 1, cover: "c.png" } },
      });

      const result = await asyncUploadCoverLostFound(1, file)(dispatch);

      expect(result).toBe(true);
      expect(lostFoundApi.uploadCover).toHaveBeenCalledWith(1, file);
      expect(showSuccessDialog).toHaveBeenCalledWith("Cover laporan berhasil diubah!");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 1, cover: "c.png" }));
    });

    it("should skip store update when response has no lost_found", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "uploadCover").mockResolvedValue({ status: "success" });

      expect(await asyncUploadCoverLostFound(1, file)(dispatch)).toBe(true);
      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: ActionType.SET_LOST_FOUND })
      );
    });

    it("should return false with server message on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "uploadCover").mockResolvedValue({
        status: "fail",
        message: "Terlalu besar",
      });

      expect(await asyncUploadCoverLostFound(1, file)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Terlalu besar");
    });

    it("should return false with fallback message on empty response", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "uploadCover").mockResolvedValue(null);

      expect(await asyncUploadCoverLostFound(1, file)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal mengunggah cover");
    });

    it("should return false when request throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "uploadCover").mockRejectedValue(new Error("Upload err"));

      expect(await asyncUploadCoverLostFound(1, file)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Upload err");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundChangeCoverActionCreator(false));
    });
  });

  describe("asyncDeleteLostFound", () => {
    it("should return true and flag deleted on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue({ success: true });

      const result = await asyncDeleteLostFound(1)(dispatch);

      expect(result).toBe(true);
      expect(lostFoundApi.deleteLostFound).toHaveBeenCalledWith(1);
      expect(showSuccessDialog).toHaveBeenCalledWith("Laporan berhasil dihapus!");
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(true));
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundDeleteActionCreator(false));
    });

    it("should also accept status success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue({ status: "success" });

      expect(await asyncDeleteLostFound(1)(dispatch)).toBe(true);
    });

    it("should return false with server message on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue({
        status: "fail",
        message: "Bukan pemilik",
      });

      expect(await asyncDeleteLostFound(1)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Bukan pemilik");
    });

    it("should return false with fallback message on empty response", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue(null);

      expect(await asyncDeleteLostFound(1)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal menghapus laporan");
    });

    it("should return false when request throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "deleteLostFound").mockRejectedValue(new Error("Del err"));

      expect(await asyncDeleteLostFound(1)(dispatch)).toBe(false);
      expect(showErrorDialog).toHaveBeenCalledWith("Del err");
      expect(dispatch).toHaveBeenLastCalledWith(setIsLostFoundDeleteActionCreator(false));
    });
  });

  describe("asyncGetLostFoundStats", () => {
    it("should dispatch combined daily and monthly stats", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getDailyStats").mockResolvedValue({ data: { d: 1 } });
      vi.spyOn(lostFoundApi, "getMonthlyStats").mockResolvedValue({ data: { m: 2 } });

      const result = await asyncGetLostFoundStats()(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundStatsActionCreator({ daily: { d: 1 }, monthly: { m: 2 } })
      );
    });

    it("should fall back to null when stats data is missing", async () => {
      const dispatch = vi.fn();
      vi.spyOn(lostFoundApi, "getDailyStats").mockResolvedValue(undefined);
      vi.spyOn(lostFoundApi, "getMonthlyStats").mockResolvedValue({});

      const result = await asyncGetLostFoundStats()(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundStatsActionCreator({ daily: null, monthly: null })
      );
    });

    it("should return false and log error when request throws", async () => {
      const dispatch = vi.fn();
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(lostFoundApi, "getDailyStats").mockRejectedValue(new Error("Stats err"));
      vi.spyOn(lostFoundApi, "getMonthlyStats").mockResolvedValue({ data: {} });

      const result = await asyncGetLostFoundStats()(dispatch);

      expect(result).toBe(false);
      expect(errorSpy).toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
