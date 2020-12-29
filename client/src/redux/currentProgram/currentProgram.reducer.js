import types from './currentProgram.types';

const INITIAL_STATE = null;

const currentProgramReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_PROGRAM:
      return {
        ...action.payload,
      };
    case types.CLEAR_CURRENT_PROGRAM:
      return null;
    default:
      return state;
  }
};

export default currentProgramReducer;
