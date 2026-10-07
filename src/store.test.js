import { describe, it, expect } from "vitest";
import store, { store as namedStore } from "./store";
import { setLostFoundsActionCreator } from "./features/lost-founds/states/action";
import { setProfileActionCreator } from "./features/users/states/action";
import { setIsAuthLoginActionCreator } from "./features/auth/states/action";

describe("store", () => {
  it("should export the same store as default and named export", () => {
    expect(store).toBe(namedStore);
  });

  it("should register every reducer with its initial state", () => {
    expect(Object.keys(store.getState()).sort()).toEqual(
      [
        "isAuthLogin",
        "isAuthLogout",
        "isAuthRegister",
        "isChangeProfile",
        "isChangeProfilePassword",
        "isChangeProfilePhoto",
        "isLostFound",
        "isLostFoundAdd",
        "isLostFoundAdded",
        "isLostFoundChange",
        "isLostFoundChangeCover",
        "isLostFoundChanged",
        "isLostFoundChangedCover",
        "isLostFoundDelete",
        "isLostFoundDeleted",
        "isProfile",
        "lostFound",
        "lostFoundStats",
        "lostFounds",
        "profile",
        "user",
        "users",
      ].sort()
    );
    expect(store.getState().lostFounds).toEqual([]);
    expect(store.getState().profile).toBeNull();
  });

  it("should update state when actions are dispatched", () => {
    store.dispatch(setLostFoundsActionCreator([{ id: 1 }]));
    store.dispatch(setProfileActionCreator({ id: 7 }));
    store.dispatch(setIsAuthLoginActionCreator(true));

    expect(store.getState().lostFounds).toEqual([{ id: 1 }]);
    expect(store.getState().profile).toEqual({ id: 7 });
    expect(store.getState().isAuthLogin).toBe(true);
  });
});
