import { describe, it, expect } from "vitest";
import { ActionType } from "./action";
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
} from "./reducer";

const cases = [
  ["lostFoundsReducer", lostFoundsReducer, ActionType.SET_LOST_FOUNDS, [], [{ id: 1 }]],
  ["lostFoundReducer", lostFoundReducer, ActionType.SET_LOST_FOUND, null, { id: 1 }],
  ["isLostFoundReducer", isLostFoundReducer, ActionType.SET_IS_LOST_FOUND, false, true],
  ["isLostFoundAddReducer", isLostFoundAddReducer, ActionType.SET_IS_LOST_FOUND_ADD, false, true],
  [
    "isLostFoundAddedReducer",
    isLostFoundAddedReducer,
    ActionType.SET_IS_LOST_FOUND_ADDED,
    false,
    true,
  ],
  [
    "isLostFoundChangeReducer",
    isLostFoundChangeReducer,
    ActionType.SET_IS_LOST_FOUND_CHANGE,
    false,
    true,
  ],
  [
    "isLostFoundChangedReducer",
    isLostFoundChangedReducer,
    ActionType.SET_IS_LOST_FOUND_CHANGED,
    false,
    true,
  ],
  [
    "isLostFoundChangeCoverReducer",
    isLostFoundChangeCoverReducer,
    ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
    false,
    true,
  ],
  [
    "isLostFoundChangedCoverReducer",
    isLostFoundChangedCoverReducer,
    ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
    false,
    true,
  ],
  [
    "isLostFoundDeleteReducer",
    isLostFoundDeleteReducer,
    ActionType.SET_IS_LOST_FOUND_DELETE,
    false,
    true,
  ],
  [
    "isLostFoundDeletedReducer",
    isLostFoundDeletedReducer,
    ActionType.SET_IS_LOST_FOUND_DELETED,
    false,
    true,
  ],
  [
    "lostFoundStatsReducer",
    lostFoundStatsReducer,
    ActionType.SET_LOST_FOUND_STATS,
    null,
    { daily: {}, monthly: {} },
  ],
];

describe("lost-founds reducers", () => {
  describe.each(cases)("%s", (_name, reducer, type, initial, payload) => {
    it("should return initial state when state and action are undefined", () => {
      expect(reducer(undefined, undefined)).toEqual(initial);
    });

    it("should return initial state for unknown action", () => {
      expect(reducer(undefined, { type: "UNKNOWN" })).toEqual(initial);
    });

    it("should keep current state for unknown action", () => {
      expect(reducer(payload, { type: "UNKNOWN" })).toBe(payload);
    });

    it("should replace state with payload for its action type", () => {
      expect(reducer(initial, { type, payload })).toBe(payload);
    });
  });
});
