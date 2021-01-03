import types from './currentWorkouts.types';

const INITIAL_STATE = null;

const currentWorkoutsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_CURRENT_WORKOUT:
      return [...state, action.payload];
    case types.SET_CURRENT_WORKOUTS:
    case types.UPDATE_CURRENT_WORKOUTS:
      return action.payload;
    case types.UPDATE_CURRENT_WORKOUT:
      return state.currentWorkouts.map(workout =>
        workout.program_workout_id === action.payload.program_workout_id ? action.payload : workout
      );
    case types.CLEAR_CURRENT_WORKOUTS:
      return null;
    default:
      return state;
  }
};

export default currentWorkoutsReducer;
