import { ActionType } from "./action";

export const lostFoundsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case ActionType.SET_LOST_FOUNDS:
      return action.payload;
    default:
      return state;
  }
};

export const lostFoundReducer = (state = null, action = {}) => {
  switch (action.type) {
    case ActionType.SET_LOST_FOUND:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundAddReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_ADD:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundAddedReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_ADDED:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundChangeReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGE:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundChangedReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGED:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundChangeCoverReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGE_COVER:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundChangedCoverReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGED_COVER:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundDeleteReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_DELETE:
      return action.payload;
    default:
      return state;
  }
};

export const isLostFoundDeletedReducer = (state = false, action = {}) => {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_DELETED:
      return action.payload;
    default:
      return state;
  }
};

export const lostFoundStatsReducer = (state = { daily: null, monthly: null }, action = {}) => {
  switch (action.type) {
    case ActionType.SET_LOST_FOUND_STATS:
      return action.payload;
    default:
      return state;
  }
};