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

// Get all users
export function setUsersActionCreator(users) {
  return {
    type: ActionType.SET_USERS,
    payload: users,
  };
}

export function asyncSetUsers() {
  return async (dispatch) => {
    try {
      const users = await userApi.getUsers();
      dispatch(setUsersActionCreator(users));
      return true;
    } catch {
      dispatch(setUsersActionCreator([]));
      return false;
    }
  };
}

// Get user by ID
export function setUserActionCreator(user) {
  return {
    type: ActionType.SET_USER,
    payload: user,
  };
}

export function asyncSetUserById(userId) {
  return async (dispatch) => {
    try {
      const user = await userApi.getUserById(userId);
      dispatch(setUserActionCreator(user));
      return true;
    } catch {
      dispatch(setUserActionCreator(null));
      return false;
    }
  };
}
export const asyncSetUser = asyncSetUserById;

// Get user profile
export function setProfileActionCreator(profile) {
  return {
    type: ActionType.SET_PROFILE,
    payload: profile,
  };
}

export function setIsProfile(isProfile) {
  return {
    type: ActionType.SET_IS_PROFILE,
    payload: isProfile,
  };
}
export const setIsProfileActionCreator = setIsProfile;

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
      dispatch(setIsProfile(true));
    }
  };
}

// Put profile
export function setIsChangeProfileActionCreator(isChange) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE,
    payload: isChange,
  };
}

export function asyncPutProfile(name, email) {
  return async (dispatch) => {
    try {
      const profile = await userApi.putProfile(name, email);
      dispatch(setProfileActionCreator(profile));
      showSuccessDialog("Profil berhasil diperbarui!");
      dispatch(setIsChangeProfileActionCreator(true));
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsChangeProfileActionCreator(false));
      return false;
    }
  };
}
export const asyncChangeProfile = asyncPutProfile;

// Post profile photo
export function setIsChangeProfilePhotoActionCreator(isChange) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    payload: isChange,
  };
}

export function asyncPostProfilePhoto(photo) {
  return async (dispatch) => {
    try {
      const message = await userApi.postProfilePhoto(photo);
      showSuccessDialog(message || "Foto profil berhasil diperbarui!");
      const profile = await userApi.getProfile();
      dispatch(setProfileActionCreator(profile));
      dispatch(setIsChangeProfilePhotoActionCreator(true));
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsChangeProfilePhotoActionCreator(false));
      return false;
    }
  };
}
export const asyncChangeProfilePhoto = asyncPostProfilePhoto;

// Put profile password
export function setIsChangeProfilePasswordActionCreator(isChange) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: isChange,
  };
}

export function asyncPutProfilePassword(oldPassword, newPassword, newPasswordConfirmation) {
  return async (dispatch) => {
    try {
      const message = await userApi.putProfilePassword(
        oldPassword,
        newPassword,
        newPasswordConfirmation
      );
      showSuccessDialog(message || "Kata sandi berhasil diperbarui!");
      dispatch(setIsChangeProfilePasswordActionCreator(true));
      return true;
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setIsChangeProfilePasswordActionCreator(false));
      return false;
    }
  };
}
export const asyncChangeProfilePassword = asyncPutProfilePassword;
