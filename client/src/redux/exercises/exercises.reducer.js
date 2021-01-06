import types from './exercises.types';

const initialState = {
  currentExercise: null,
  allExercises: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_EXERCISE:
      return { ...state, ...payload };

    default:
      return state;
  }
};
