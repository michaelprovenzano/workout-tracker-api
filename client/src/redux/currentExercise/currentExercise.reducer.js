import types from './currentExercise.types';

const INITIAL_STATE = null;

const currentExerciseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_EXERCISE:
    case types.UPDATE_CURRENT_EXERCISE:
      return action.payload;
    case types.CLEAR_CURRENT_EXERCISE:
      return null;
    default:
      return state;
  }
};

export default currentExerciseReducer;
