import types from './programWorkouts.types';

const initialState = {
  currentProgramWorkout: null,
  nextProgramWorkout: null,
  currentProgramWorkouts: [],
  loading: true,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_PROGRAM_WORKOUT:
      return {
        ...state,
        currentProgramWorkouts: [...state.currentProgramWorkouts, payload],
        loading: false,
      };
    case types.UPDATE_PROGRAM_WORKOUT:
      return {
        ...state,
        currentProgramWorkouts: state.currentProgramWorkouts.map(workout =>
          workout.program_workout_id === payload.program_workout_id ? payload : workout
        ),
        loading: false,
      };
    case types.DELETE_PROGRAM_WORKOUT:
      return {
        ...state,
        currentProgramWorkout: null,
        currentProgramWorkouts: state.currentProgramWorkouts.filter(
          workout => workout.program_workout_id !== parseInt(payload)
        ),
        loading: false,
      };
    case types.SET_PROGRAM_WORKOUTS:
    case types.UPDATE_PROGRAM_WORKOUTS:
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
    case types.CLEAR_CURRENT_PROGRAM_WORKOUTS:
      return {
        ...state,
        currentProgramWorkouts: [],
        loading: false,
      };
    case types.FETCH_NEXT_PROGRAM_WORKOUT:
    case types.SET_NEXT_PROGRAM_WORKOUT:
      return {
        ...state,
        nextProgramWorkout: payload,
        loading: false,
      };
    case types.CLEAR_NEXT_PROGRAM_WORKOUT:
      return {
        ...state,
        nextProgramWorkout: null,
        loading: false,
      };
    case types.RESET_PROGRAM_WORKOUTS:
      return {
        currentProgramWorkout: null,
        nextProgramWorkout: null,
        currentProgramWorkouts: [],
        loading: false,
        error: null,
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
