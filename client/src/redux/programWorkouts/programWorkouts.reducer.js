import types from './programWorkouts.types';

const initialState = {
  currentProgramWorkout: null,
  currentProgramWorkouts: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SET_PROGRAM_WORKOUTS:
      return { ...state, ...payload };

    default:
      return state;
  }
};
