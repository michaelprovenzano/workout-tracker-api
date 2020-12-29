import types from './currentPrograms.types';

const INITIAL_STATE = null;

const currentProgramsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_PROGRAMS:
      return action.payload;
    case types.CLEAR_CURRENT_PROGRAMS:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default currentProgramsReducer;
