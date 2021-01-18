import types from './workoutExercises.types';

const initialState = {
  currentWorkoutExercise: null,
  currentWorkoutExercises: [],
  loading: true,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_WORKOUT_EXERCISE:
      return {
        ...state,
        currentWorkoutExercises: [...state.currentWorkoutExercises, payload],
        loading: false,
      };
    case types.UPDATE_WORKOUT_EXERCISE:
      return {
        ...state,
        currentWorkoutExercises: state.currentWorkoutExercises.map(exercise =>
          exercise.workout_exercise_id === payload.workout_exercise_id ? payload : exercise
        ),
        loading: false,
      };
    case types.DELETE_WORKOUT_EXERCISE:
      let newCurrentExercise = null;
      if (state.currentWorkoutExercise)
        state.currentWorkoutExercise.workout_exercise_id === payload
          ? (newCurrentExercise = null)
          : (newCurrentExercise = state.currentWorkoutExercise);

      return {
        ...state,
        currentWorkoutExercise: newCurrentExercise,
        currentWorkoutExercises: state.currentWorkoutExercises.filter(
          exercise => exercise.workout_exercise_id !== payload
        ),
        loading: false,
      };
    case types.ADD_CURRENT_WORKOUT_EXERCISE:
      return {
        ...state,
        currentWorkoutExercise: payload,
        currentWorkoutExercises: [...state.currentWorkoutExercises, payload],
        loading: false,
      };
    case types.SET_CURRENT_WORKOUT_EXERCISE:
      return {
        ...state,
        currentWorkoutExercise: payload,
        loading: false,
      };
    case types.UPDATE_CURRENT_WORKOUT_EXERCISE:
      return {
        ...state,
        currentWorkoutExercise: payload,
        currentWorkoutExercises: state.currentWorkoutExercises.map(exercise =>
          exercise.workout_exercise_id === payload.workout_exercise_id ? payload : exercise
        ),
        loading: false,
      };
    case types.CLEAR_CURRENT_WORKOUT_EXERCISE:
      return {
        ...state,
        currentWorkoutExercise: null,
        loading: false,
      };
    case types.FETCH_WORKOUT_EXERCISES:
    case types.UPDATE_CURRENT_WORKOUT_EXERCISES:
      return {
        ...state,
        currentWorkoutExercises: payload,
        loading: false,
      };
    case types.CLEAR_CURRENT_WORKOUT_EXERCISES:
      return {
        ...state,
        currentWorkoutExercises: [],
        loading: false,
      };
    case types.SET_WORKOUT_EXERCISES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};
