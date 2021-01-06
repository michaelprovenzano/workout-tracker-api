import types from './workoutExercises.types';

const initialState = {
  currentWorkoutExercise: null,
  currentWorkoutExercises: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_WORKOUT_EXERCISE:
      return { ...state, ...payload };

    default:
      return state;
  }
};
