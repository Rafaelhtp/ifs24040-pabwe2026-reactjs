import { ActionType } from "./action";
import { ActionType as AuthActionType } from "../../auth/states/action";

// Saat logout, data sesi pengguna dikosongkan.
const isLogout = (action) => action.type === AuthActionType.SET_IS_AUTH_LOGOUT && action.payload;

export function usersReducer(state = [], action = {}) {
  switch (action.type) {
    case ActionType.SET_USERS:
      return action.payload;
    default:
      return state;
  }
}

export function userReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_USER:
      return action.payload;
    default:
      return state;
  }
}

export function profileReducer(state = null, action = {}) {
  if (isLogout(action)) return null;
  switch (action.type) {
    case ActionType.SET_PROFILE:
      return action.payload;
    default:
      return state;
  }
}

export function isProfileReducer(state = false, action = {}) {
  if (isLogout(action)) return false;
  switch (action.type) {
    case ActionType.SET_IS_PROFILE:
      return action.payload;
    default:
      return state;
  }
}

export function isChangeProfileReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE:
      return action.payload;
    default:
      return state;
  }
}

export function isChangeProfilePhotoReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE_PHOTO:
      return action.payload;
    default:
      return state;
  }
}

export function isChangeProfilePasswordReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE_PASSWORD:
      return action.payload;
    default:
      return state;
  }
}
