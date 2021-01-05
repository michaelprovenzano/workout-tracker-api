import types from './currentWorkout.types';
import api from '../../utils/apiCalls';

export const setCurrentWorkout = programWorkoutId => async dispatch => {
  let workout = await api.get('program-workouts', `program_workout_id=${programWorkoutId}`);

  dispatch({
    type: types.SET_CURRENT_WORKOUT,
    payload: workout[0],
  });
};

// Conflict with currentWorkoutsReducer
export const updateCurrentWorkout = workout => async dispatch => {
  const { workout_name } = workout;
  let result = await api.updateOne('workouts', workout.workout_id, { workout_name });
  // console.log(result);
  // if (result) {
  //   dispatch({
  //     type: types.UPDATE_CURRENT_WORKOUT,
  //     payload: workout,
  //   });
  // }
};

export const clearCurrentWorkout = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_WORKOUT,
  });
};
