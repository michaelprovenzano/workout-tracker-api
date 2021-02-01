import types from './exercises.types';

const initialState = {
  currentExercise: null,
  allExercises: [],
  loading: true,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_EXERCISE:
      return {
        ...state,
        allExercises: [...state.allExercises, payload],
        loading: false,
      };
    case types.UPDATE_EXERCISE:
      return {
        ...state,
        allExercises: state.allExercises.map(exercise =>
          exercise.exercise_id === payload.exercise_id ? payload : exercise
        ),
        loading: false,
      };
    case types.ADD_CURRENT_EXERCISE:
      return {
        ...state,
        currentExercise: payload,
        allExercises: [...state.allExercises, payload],
        loading: false,
      };
    case types.SET_CURRENT_EXERCISE:
      return {
        ...state,
        currentExercise: payload,
        loading: false,
      };
    case types.UPDATE_CURRENT_EXERCISE:
      return {
        ...state,
        currentExercise: payload,
        allExercises: state.allExercises.map(exercise =>
          exercise.workout_exercise_id === payload.workout_exercise_id ? payload : exercise
        ),
        loading: false,
      };
    case types.CLEAR_CURRENT_EXERCISE:
      return {
        ...state,
        currentExercise: null,
        loading: false,
      };
    case types.FETCH_ALL_EXERCISES:
    case types.UPDATE_EXERCISES:
      return {
        ...state,
        allExercises: payload,
        loading: false,
      };
    case types.CLEAR_CURRENT_EXERCISES:
      return {
        ...state,
        allExercises: [],
        loading: false,
      };
    case types.SET_EXERCISES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case types.RESET_EXERCISES:
      return {
        currentExercise: null,
        allExercises: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};
