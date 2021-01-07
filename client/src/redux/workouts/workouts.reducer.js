import types from './workouts.types';

const INITIAL_STATE = {
  currentWorkout: null,
  nextWorkout: null,
  allWorkouts: [],
  loading: true,
  error: null,
};

const workoutsReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.FETCH_ALL_WORKOUTS:
      return {
        ...state,
        allWorkouts: payload,
        loading: false,
      };
    case types.ADD_WORKOUT:
      return {
        ...state,
        allWorkouts: [...state.allWorkouts, payload],
        loading: false,
      };
    case types.FETCH_NEXT_WORKOUT:
    case types.SET_NEXT_WORKOUT:
      return {
        ...state,
        nextWorkout: payload,
        loading: false,
      };
    case types.CLEAR_NEXT_WORKOUT:
      return {
        ...state,
        nextWorkout: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default workoutsReducer;
