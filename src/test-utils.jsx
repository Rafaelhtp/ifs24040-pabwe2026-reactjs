import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./features/auth/states/reducer";
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./features/users/states/reducer";
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

export const rootReducer = {
  isAuthLogin: isAuthLoginReducer,
  isAuthRegister: isAuthRegisterReducer,
  isAuthLogout: isAuthLogoutReducer,
  users: usersReducer,
  user: userReducer,
  profile: profileReducer,
  isProfile: isProfileReducer,
  isChangeProfile: isChangeProfileReducer,
  isChangeProfilePhoto: isChangeProfilePhotoReducer,
  isChangeProfilePassword: isChangeProfilePasswordReducer,
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
};

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    route = "/",
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
