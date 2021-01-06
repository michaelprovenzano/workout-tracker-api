import types from './workouts.types';

const INITIAL_STATE = {
  currentWorkout: null,
  nextWorkout: null,
  allWorkouts: [],
};

const workoutsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_ALL_WORKOUTS:
      return {
        ...state,
        allWorkouts: action.payload,
      };
    case types.ADD_WORKOUT:
      return {
        ...state,
        allWorkouts: [...state.allWorkouts, action.payload],
      };
    default:
      return state;
  }
};

export default workoutsReducer;
