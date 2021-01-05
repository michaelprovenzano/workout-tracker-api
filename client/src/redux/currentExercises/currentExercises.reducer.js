import types from './currentExercises.types';

const INITIAL_STATE = null;

const currentExercisesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_EXERCISES:
    case types.UPDATE_CURRENT_EXERCISES:
      return action.payload;
    case types.UPDATE_ONE_CURRENT_EXERCISES:
      if (state === INITIAL_STATE) return INITIAL_STATE;
      return state.map(exercise =>
        exercise.exercise_id === action.payload.exercise_id ? action.payload : exercise
      );
    case types.CLEAR_CURRENT_EXERCISES:
      return null;
    default:
      return state;
  }
};

export default currentExercisesReducer;
