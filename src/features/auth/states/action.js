import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import authApi from "../api/authApi";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "SET_IS_AUTH_REGISTER",
  SET_IS_AUTH_LOGOUT: "SET_IS_AUTH_LOGOUT",
};

// ===== Action creators =====
export function setIsAuthLoginActionCreator(isAuthLogin) {
  return { type: ActionType.SET_IS_AUTH_LOGIN, payload: isAuthLogin };
}

export function setIsAuthRegisterActionCreator(isAuthRegister) {
  return { type: ActionType.SET_IS_AUTH_REGISTER, payload: isAuthRegister };
}

export function setIsAuthLogoutActionCreator(isAuthLogout) {
  return { type: ActionType.SET_IS_AUTH_LOGOUT, payload: isAuthLogout };
}

// ===== Async thunks =====
// Semua thunk mengembalikan boolean agar halaman bisa langsung bereaksi.
export function asyncSetIsAuthLogin(email, password) {
  return async (dispatch) => {
    try {
      const token = await authApi.postLogin(email, password);
      putAccessToken(token);
      dispatch(setIsAuthLogoutActionCreator(false));
      dispatch(setIsAuthLoginActionCreator(true));
      return true;
    } catch (error) {
      dispatch(setIsAuthLoginActionCreator(false));
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncSetIsAuthRegister(name, email, password) {
  return async (dispatch) => {
    try {
      const message = await authApi.postRegister(name, email, password);
      dispatch(setIsAuthRegisterActionCreator(true));
      showSuccessDialog(message || "Pendaftaran berhasil, silakan masuk.");
      return true;
    } catch (error) {
      dispatch(setIsAuthRegisterActionCreator(false));
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch) => {
    try {
      await authApi.postLogout();
    } catch {
      // Token lokal tetap dihapus walaupun server gagal merespons.
    } finally {
      removeAccessToken();
      dispatch(setIsAuthLoginActionCreator(false));
      dispatch(setIsAuthLogoutActionCreator(true));
    }
    return true;
  };
}
