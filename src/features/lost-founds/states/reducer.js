import { ActionType } from "./action";

// Membuat reducer sederhana: mengganti state dengan payload untuk action type tertentu.
function createValueReducer(type, initialState) {
  return function valueReducer(state = initialState, action = {}) {
    switch (action.type) {
      case type:
        return action.payload;
      default:
        return state;
    }
  };
}

export const lostFoundsReducer = createValueReducer(ActionType.SET_LOST_FOUNDS, []);
export const lostFoundReducer = createValueReducer(ActionType.SET_LOST_FOUND, null);
export const isLostFoundReducer = createValueReducer(ActionType.SET_IS_LOST_FOUND, false);

export const isLostFoundAddReducer = createValueReducer(ActionType.SET_IS_LOST_FOUND_ADD, false);
export const isLostFoundAddedReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_ADDED,
  false
);

export const isLostFoundChangeReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_CHANGE,
  false
);
export const isLostFoundChangedReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_CHANGED,
  false
);

export const isLostFoundChangeCoverReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
  false
);
export const isLostFoundChangedCoverReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
  false
);

export const isLostFoundDeleteReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_DELETE,
  false
);
export const isLostFoundDeletedReducer = createValueReducer(
  ActionType.SET_IS_LOST_FOUND_DELETED,
  false
);

export const lostFoundStatsReducer = createValueReducer(ActionType.SET_LOST_FOUND_STATS, null);