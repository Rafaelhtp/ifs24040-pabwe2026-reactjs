import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import userApi from "../api/userApi";

export const ActionType = {
  SET_USERS: "SET_USERS",
  SET_USER: "SET_USER",
  SET_PROFILE: "SET_PROFILE",
  SET_IS_PROFILE: "SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "SET_IS_CHANGE_PROFILE_PASSWORD",
};

// ===== Action creators =====
export function setUsersActionCreator(users) {
  return { type: ActionType.SET_USERS, payload: users };
}

export function setUserActionCreator(user) {
  return { type: ActionType.SET_USER, payload: user };
}

export function setProfileActionCreator(profile) {
  return { type: ActionType.SET_PROFILE, payload: profile };
}

export function setIsProfileActionCreator(isProfile) {
  return { type: ActionType.SET_IS_PROFILE, payload: isProfile };
}

export function setIsChangeProfileActionCreator(isChange) {
  return { type: ActionType.SET_IS_CHANGE_PROFILE, payload: isChange };
}

export function setIsChangeProfilePhotoActionCreator(isChange) {
  return { type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO, payload: isChange };
}

export function setIsChangeProfilePasswordActionCreator(isChange) {
  return { type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD, payload: isChange };
}

// ===== Async thunks =====
export function asyncSetUsers() {
  return async (dispatch) => {
    try {
      const users = await userApi.getUsers();
      dispatch(setUsersActionCreator(users));
      return true;
    } catch (error) {
      dispatch(setUsersActionCreator([]));
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncSetUser(userId) {
  return async (dispatch) => {
    try {
      const user = await userApi.getUserById(userId);
      dispatch(setUserActionCreator(user));
      return true;
    } catch (error) {
      dispatch(setUserActionCreator(null));
      showErrorDialog(error.message);
      return false;
    }
  };
}

// Dipakai LostFoundLayout untuk verifikasi token: false berarti sesi tidak valid.
export function asyncSetProfile() {
  return async (dispatch) => {
    try {
      const profile = await userApi.getProfile();
      dispatch(setProfileActionCreator(profile));
      return true;
    } catch {
      dispatch(setProfileActionCreator(null));
      return false;
    } finally {
      dispatch(setIsProfileActionCreator(true));
    }
  };
}

export function asyncChangeProfile(name, email) {
  return async (dispatch) => {
    dispatch(setIsChangeProfileActionCreator(false));
    try {
      const updated = await userApi.putProfile(name, email);
      const profile = updated ?? (await userApi.getProfile());
      dispatch(setProfileActionCreator(profile));
      dispatch(setIsChangeProfileActionCreator(true));
      showSuccessDialog("Profil berhasil diperbarui.");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncChangeProfilePhoto(photo) {
  return async (dispatch) => {
    dispatch(setIsChangeProfilePhotoActionCreator(false));
    try {
      const message = await userApi.postProfilePhoto(photo);
      const profile = await userApi.getProfile();
      dispatch(setProfileActionCreator(profile));
      dispatch(setIsChangeProfilePhotoActionCreator(true));
      showSuccessDialog(message || "Foto profil berhasil diperbarui.");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncChangeProfilePassword(password, newPassword, newPasswordConfirmation) {
  return async (dispatch) => {
    dispatch(setIsChangeProfilePasswordActionCreator(false));
    try {
      const message = await userApi.putProfilePassword(
        password,
        newPassword,
        newPasswordConfirmation
      );
      dispatch(setIsChangeProfilePasswordActionCreator(true));
      showSuccessDialog(message || "Kata sandi berhasil diperbarui.");
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      return false;
    }
  };
}
