import types from './programWorkouts.types';
import api from '../../utils/apiCalls';

export const fetchProgramWorkouts = programId => async dispatch => {
  let result = await api.get('program-workouts', `program_id=${programId}`);

  errorCheck(dispatch, result);

  dispatch({
    type: types.FETCH_PROGRAM_WORKOUTS,
    payload: result,
  });
};

export const addProgramWorkout = programWorkout => async dispatch => {
  const { workout_name } = programWorkout;
  delete programWorkout.workout_name;

  let workout = await api.addOne('program-workouts', programWorkout);
  errorCheck(dispatch, workout);

  workout.workout_name = workout_name;

  if (workout) {
    dispatch({
      type: types.ADD_PROGRAM_WORKOUT,
      payload: workout,
    });
  }
};

export const updateProgramWorkouts = workouts => async dispatch => {
  let result = await api.patchReq('program-workouts', workouts);

  errorCheck(dispatch, result);

  if (result.status === 'success') {
    dispatch({
      type: types.UPDATE_PROGRAM_WORKOUTS,
      payload: result,
    });
  }
};

export const clearProgramWorkouts = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAM_WORKOUTS,
  });
};

export const addCurrentProgramWorkout = programWorkout => async dispatch => {
  const { workout_name } = programWorkout;
  delete programWorkout.workout_name;

  let workout = await api.addOne('program-workouts', programWorkout);
  errorCheck(dispatch, workout);

  workout.workout_name = workout_name;

  if (workout) {
    dispatch({
      type: types.ADD_CURRENT_PROGRAM_WORKOUT,
      payload: workout,
    });
  }
};

export const setCurrentProgramWorkout = programWorkout => async dispatch => {
  dispatch({
    type: types.SET_CURRENT_PROGRAM_WORKOUT,
    payload: programWorkout,
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
    type: types.CLEAR_CURRENT_PROGRAM_WORKOUT,
  });
};

const errorCheck = (dispatch, result) => {
  if (result.status === 'fail') {
    dispatch({
      type: types.SET_PROGRAM_WORKOUTS_ERROR,
      payload: result.data,
    });
  }
};
