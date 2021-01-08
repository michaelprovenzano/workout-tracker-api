import types from './programWorkouts.types';

const initialState = {
  currentProgramWorkout: null,
  currentProgramWorkouts: [],
  loading: true,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SET_PROGRAM_WORKOUTS:
    case types.FETCH_PROGRAM_WORKOUTS:
      return { ...state, currentProgramWorkouts: payload, loading: false };
    case types.CLEAR_CURRENT_PROGRAM_WORKOUTS:
      return {
        ...state,
        currentProgramWorkouts: [],
        loading: false,
      };
    case types.ADD_CURRENT_PROGRAM_WORKOUT:
      return {
        ...state,
        currentProgramWorkout: payload,
        currentProgramWorkouts: [...state.currentProgramWorkouts, payload],
        loading: false,
      };
    case types.SET_CURRENT_PROGRAM_WORKOUT:
      return {
        ...state,
        currentProgramWorkout: payload,
        loading: false,
      };
    case types.CLEAR_CURRENT_PROGRAM_WORKOUT:
      return {
        ...state,
        currentProgramWorkout: null,
        loading: false,
      };
    case types.SET_PROGRAM_WORKOUTS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};
