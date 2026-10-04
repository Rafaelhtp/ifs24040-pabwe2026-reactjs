import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import lostFoundApi from "../api/lostFoundApi";

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

const createAction = (type) => (payload) => ({ type, payload });

// ===== Action creators =====
export const setLostFoundsActionCreator = createAction(ActionType.SET_LOST_FOUNDS);
export const setLostFoundActionCreator = createAction(ActionType.SET_LOST_FOUND);
export const setIsLostFoundActionCreator = createAction(ActionType.SET_IS_LOST_FOUND);
export const setIsLostFoundAddActionCreator = createAction(ActionType.SET_IS_LOST_FOUND_ADD);
export const setIsLostFoundAddedActionCreator = createAction(ActionType.SET_IS_LOST_FOUND_ADDED);
export const setIsLostFoundChangeActionCreator = createAction(ActionType.SET_IS_LOST_FOUND_CHANGE);
export const setIsLostFoundChangedActionCreator = createAction(
  ActionType.SET_IS_LOST_FOUND_CHANGED
);
export const setIsLostFoundChangeCoverActionCreator = createAction(
  ActionType.SET_IS_LOST_FOUND_CHANGE_COVER
);
export const setIsLostFoundChangedCoverActionCreator = createAction(
  ActionType.SET_IS_LOST_FOUND_CHANGED_COVER
);
export const setIsLostFoundDeleteActionCreator = createAction(ActionType.SET_IS_LOST_FOUND_DELETE);
export const setIsLostFoundDeletedActionCreator = createAction(
  ActionType.SET_IS_LOST_FOUND_DELETED
);
export const setLostFoundStatsActionCreator = createAction(ActionType.SET_LOST_FOUND_STATS);

// ===== Async thunks =====
export function asyncSetLostFounds(filters = {}) {
  return async (dispatch) => {
    try {
      const lostFounds = await lostFoundApi.getLostFounds(filters);
      dispatch(setLostFoundsActionCreator(lostFounds));
      return true;
    } catch (error) {
      dispatch(setLostFoundsActionCreator([]));
      showErrorDialog(error.message);
      return false;
    }
  };
}

// isLostFound = true menandakan proses pengambilan detail sudah selesai.
export function asyncSetLostFound(id) {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(false));
    dispatch(setLostFoundActionCreator(null));
    try {
      const lostFound = await lostFoundApi.getLostFoundById(id);
      dispatch(setLostFoundActionCreator(lostFound));
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setIsLostFoundActionCreator(true));
    }
  };
}

export function asyncSetLostFoundStats() {
  return async (dispatch) => {
    try {
      const [daily, monthly] = await Promise.all([
        lostFoundApi.getStatsDaily(),
        lostFoundApi.getStatsMonthly(),
      ]);
      dispatch(setLostFoundStatsActionCreator({ daily, monthly }));
      return true;
    } catch (error) {
      dispatch(setLostFoundStatsActionCreator(null));
      showErrorDialog(error.message);
      return false;
    }
  };
}

// Pola mutasi: reset flag "selesai", nyalakan flag "proses", panggil API, beri umpan balik.
function runMutation({ processCreator, doneCreator, request, successMessage }) {
  return async (dispatch) => {
    dispatch(doneCreator(false));
    dispatch(processCreator(true));
    try {
      const result = await request();
      dispatch(doneCreator(true));
      showSuccessDialog(successMessage);
      return result ?? true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(processCreator(false));
    }
  };
}

export function asyncAddLostFound({ title, description, status }) {
  return runMutation({
    processCreator: setIsLostFoundAddActionCreator,
    doneCreator: setIsLostFoundAddedActionCreator,
    request: () => lostFoundApi.postLostFound({ title, description, status }),
    successMessage: "Laporan berhasil ditambahkan.",
  });
}

export function asyncChangeLostFound(id, { title, description, status, is_completed }) {
  return runMutation({
    processCreator: setIsLostFoundChangeActionCreator,
    doneCreator: setIsLostFoundChangedActionCreator,
    request: () => lostFoundApi.putLostFound(id, { title, description, status, is_completed }),
    successMessage: "Laporan berhasil diperbarui.",
  });
}

export function asyncChangeLostFoundCover(id, cover) {
  return runMutation({
    processCreator: setIsLostFoundChangeCoverActionCreator,
    doneCreator: setIsLostFoundChangedCoverActionCreator,
    request: () => lostFoundApi.postLostFoundCover(id, cover),
    successMessage: "Foto cover berhasil diperbarui.",
  });
}

export function asyncDeleteLostFound(id) {
  return runMutation({
    processCreator: setIsLostFoundDeleteActionCreator,
    doneCreator: setIsLostFoundDeletedActionCreator,
    request: () => lostFoundApi.deleteLostFound(id),
    successMessage: "Laporan berhasil dihapus.",
  });
}