import types from './alerts.types';

const INITIAL_STATE = [];

const alertsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_ALERT:
      return [...state, action.payload];
    case types.REMOVE_ALERT:
      return [...state.filter(msg => msg !== action.payload)];
    default:
      return state;
  }
};

export default alertsReducer;
