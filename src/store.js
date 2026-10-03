import { configureStore } from "@reduxjs/toolkit";

// Auth reducers
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./features/auth/states/reducer";

// Users reducers
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./features/users/states/reducer";

// Lost & Founds reducers
import {
  lostFoundsReducer,
  lostFoundReducer,
  isLostFoundReducer,
  isLostFoundAddReducer,
  isLostFoundAddedReducer,
  isLostFoundChangeReducer,
  isLostFoundChangedReducer,
  isLostFoundChangeCoverReducer,
  isLostFoundChangedCoverReducer,
  isLostFoundDeleteReducer,
  isLostFoundDeletedReducer,
  lostFoundStatsReducer,
} from "./features/lost-founds/states/reducer";

export const store = configureStore({
  reducer: {
    // Auth
    isAuthLogin: isAuthLoginReducer,
    isAuthRegister: isAuthRegisterReducer,
    isAuthLogout: isAuthLogoutReducer,

    // Users
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
    isProfile: isProfileReducer,
    isChangeProfile: isChangeProfileReducer,
    isChangeProfilePhoto: isChangeProfilePhotoReducer,
    isChangeProfilePassword: isChangeProfilePasswordReducer,

    // Lost & Founds
    lostFounds: lostFoundsReducer,
    lostFound: lostFoundReducer,
    isLostFound: isLostFoundReducer,
    isLostFoundAdd: isLostFoundAddReducer,
    isLostFoundAdded: isLostFoundAddedReducer,
    isLostFoundChange: isLostFoundChangeReducer,
    isLostFoundChanged: isLostFoundChangedReducer,
    isLostFoundChangeCover: isLostFoundChangeCoverReducer,
    isLostFoundChangedCover: isLostFoundChangedCoverReducer,
    isLostFoundDelete: isLostFoundDeleteReducer,
    isLostFoundDeleted: isLostFoundDeletedReducer,
    lostFoundStats: lostFoundStatsReducer,
  },
});

export default store;