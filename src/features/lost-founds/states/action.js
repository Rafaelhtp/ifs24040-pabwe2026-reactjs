import { lostFoundApi } from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_LOST_FOUNDS: "SET_LOST_FOUNDS",
  SET_LOST_FOUND: "SET_LOST_FOUND",
  SET_IS_LOST_FOUND: "SET_IS_LOST_FOUND",
  SET_IS_LOST_FOUND_ADD: "SET_IS_LOST_FOUND_ADD",
  SET_IS_LOST_FOUND_ADDED: "SET_IS_LOST_FOUND_ADDED",
  SET_IS_LOST_FOUND_CHANGE: "SET_IS_LOST_FOUND_CHANGE",
  SET_IS_LOST_FOUND_CHANGED: "SET_IS_LOST_FOUND_CHANGED",
  SET_IS_LOST_FOUND_CHANGE_COVER: "SET_IS_LOST_FOUND_CHANGE_COVER",
  SET_IS_LOST_FOUND_CHANGED_COVER: "SET_IS_LOST_FOUND_CHANGED_COVER",
  SET_IS_LOST_FOUND_DELETE: "SET_IS_LOST_FOUND_DELETE",
  SET_IS_LOST_FOUND_DELETED: "SET_IS_LOST_FOUND_DELETED",
  SET_LOST_FOUND_STATS: "SET_LOST_FOUND_STATS",
};

export const setLostFoundsActionCreator = (lostFounds) => ({
  type: ActionType.SET_LOST_FOUNDS,
  payload: lostFounds,
});

export const setLostFoundActionCreator = (lostFound) => ({
  type: ActionType.SET_LOST_FOUND,
  payload: lostFound,
});

export const setIsLostFoundActionCreator = (isLostFound) => ({
  type: ActionType.SET_IS_LOST_FOUND,
  payload: isLostFound,
});

export const setIsLostFoundAddActionCreator = (isLostFoundAdd) => ({
  type: ActionType.SET_IS_LOST_FOUND_ADD,
  payload: isLostFoundAdd,
});

export const setIsLostFoundAddedActionCreator = (isLostFoundAdded) => ({
  type: ActionType.SET_IS_LOST_FOUND_ADDED,
  payload: isLostFoundAdded,
});

export const setIsLostFoundChangeActionCreator = (isLostFoundChange) => ({
  type: ActionType.SET_IS_LOST_FOUND_CHANGE,
  payload: isLostFoundChange,
});

export const setIsLostFoundChangedActionCreator = (isLostFoundChanged) => ({
  type: ActionType.SET_IS_LOST_FOUND_CHANGED,
  payload: isLostFoundChanged,
});

export const setIsLostFoundChangeCoverActionCreator = (isLostFoundChangeCover) => ({
  type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
  payload: isLostFoundChangeCover,
});

export const setIsLostFoundChangedCoverActionCreator = (isLostFoundChangedCover) => ({
  type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
  payload: isLostFoundChangedCover,
});

export const setIsLostFoundDeleteActionCreator = (isLostFoundDelete) => ({
  type: ActionType.SET_IS_LOST_FOUND_DELETE,
  payload: isLostFoundDelete,
});

export const setIsLostFoundDeletedActionCreator = (isLostFoundDeleted) => ({
  type: ActionType.SET_IS_LOST_FOUND_DELETED,
  payload: isLostFoundDeleted,
});

export const setLostFoundStatsActionCreator = (lostFoundStats) => ({
  type: ActionType.SET_LOST_FOUND_STATS,
  payload: lostFoundStats,
});

// --- Async Thunks ---

export const asyncGetLostFounds = (filters = {}) => {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(true));
    try {
      const response = await lostFoundApi.getLostFounds(filters);
      if (
        response &&
        (response.success ||
          response.status === "success" ||
          Array.isArray(response.data?.lost_founds))
      ) {
        dispatch(setLostFoundsActionCreator(response.data?.lost_founds || []));
      } else {
        showErrorDialog(response?.message || "Gagal memuat data lost & found");
      }
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(setIsLostFoundActionCreator(false));
    }
  };
};
export const asyncSetLostFounds = asyncGetLostFounds;

export const asyncGetLostFoundById = (id) => {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(true));
    try {
      const response = await lostFoundApi.getLostFoundById(id);
      if (
        response &&
        (response.success || response.status === "success" || response.data?.lost_found)
      ) {
        dispatch(setLostFoundActionCreator(response.data.lost_found));
      } else {
        showErrorDialog(response?.message || "Gagal memuat rincian laporan");
      }
    } catch (error) {
      showErrorDialog(error.message);
    } finally {
      dispatch(setIsLostFoundActionCreator(false));
    }
  };
};
export const asyncSetLostFound = asyncGetLostFoundById;
export const asyncSetLostFoundById = asyncGetLostFoundById;

export const asyncCreateLostFound = ({ title, description, status }) => {
  return async (dispatch) => {
    dispatch(setIsLostFoundAddActionCreator(true));
    try {
      const response = await lostFoundApi.createLostFound({ title, description, status });
      if (response && (response.success || response.status === "success")) {
        showSuccessDialog("Laporan berhasil ditambahkan!");
        dispatch(setIsLostFoundAddedActionCreator(true));
        return true;
      } else {
        showErrorDialog(response?.message || "Gagal menambahkan laporan");
        return false;
      }
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setIsLostFoundAddActionCreator(false));
    }
  };
};
export const asyncAddLostFound = asyncCreateLostFound;

export const asyncUpdateLostFound = (id, data) => {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeActionCreator(true));
    try {
      const response = await lostFoundApi.updateLostFound(id, data);
      if (response && (response.success || response.status === "success")) {
        showSuccessDialog("Laporan berhasil diperbarui!");
        dispatch(setIsLostFoundChangedActionCreator(true));
        if (response.data?.lost_found) {
          dispatch(setLostFoundActionCreator(response.data.lost_found));
        }
        return true;
      } else {
        showErrorDialog(response?.message || "Gagal memperbarui laporan");
        return false;
      }
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setIsLostFoundChangeActionCreator(false));
    }
  };
};
export const asyncChangeLostFound = asyncUpdateLostFound;

export const asyncUploadCoverLostFound = (id, file) => {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeCoverActionCreator(true));
    try {
      const response = await lostFoundApi.uploadCover(id, file);
      if (response && (response.success || response.status === "success")) {
        showSuccessDialog("Cover laporan berhasil diubah!");
        dispatch(setIsLostFoundChangedCoverActionCreator(true));
        if (response.data?.lost_found) {
          dispatch(setLostFoundActionCreator(response.data.lost_found));
        }
        return true;
      } else {
        showErrorDialog(response?.message || "Gagal mengunggah cover");
        return false;
      }
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setIsLostFoundChangeCoverActionCreator(false));
    }
  };
};
export const asyncChangeLostFoundCover = asyncUploadCoverLostFound;
export const asyncChangeCoverLostFound = asyncUploadCoverLostFound;

export const asyncDeleteLostFound = (id) => {
  return async (dispatch) => {
    dispatch(setIsLostFoundDeleteActionCreator(true));
    try {
      const response = await lostFoundApi.deleteLostFound(id);
      if (response && (response.success || response.status === "success")) {
        showSuccessDialog("Laporan berhasil dihapus!");
        dispatch(setIsLostFoundDeletedActionCreator(true));
        return true;
      } else {
        showErrorDialog(response?.message || "Gagal menghapus laporan");
        return false;
      }
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setIsLostFoundDeleteActionCreator(false));
    }
  };
};

export const asyncGetLostFoundStats = () => {
  return async (dispatch) => {
    try {
      const [dailyRes, monthlyRes] = await Promise.all([
        lostFoundApi.getDailyStats(),
        lostFoundApi.getMonthlyStats(),
      ]);
      dispatch(
        setLostFoundStatsActionCreator({
          daily: dailyRes?.data || null,
          monthly: monthlyRes?.data || null,
        })
      );
      return true;
    } catch (error) {
      console.error("Gagal memuat statistik", error);
      return false;
    }
  };
};
export const asyncSetLostFoundStats = asyncGetLostFoundStats;