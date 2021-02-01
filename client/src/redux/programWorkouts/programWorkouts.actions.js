import types from './programWorkouts.types';
import api from '../../utils/apiCalls';

export const fetchProgramWorkouts = programId => async dispatch => {
  let result = await api.get('program-workouts', `program_id=${programId}&orderBy=workout_order`);
  console.log(result);
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

export const deleteProgramWorkout = programWorkout => async dispatch => {
  let workout = await api.deleteOne('program-workouts', programWorkout.program_workout_id);

  errorCheck(dispatch, workout);

  dispatch({
    type: types.DELETE_PROGRAM_WORKOUT,
    payload: programWorkout.program_workout_id,
  });
};

export const updateProgramWorkouts = workouts => async dispatch => {
  workouts.sort((cur, prev) => cur.workout_order - prev.workout_order);
  let result = await api.patchReq('program-workouts', workouts);

  errorCheck(dispatch, result);

  if (result.status === 'success') {
    dispatch({
      type: types.UPDATE_PROGRAM_WORKOUTS,
      payload: workouts,
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

export const updateProgramWorkout = workout => async dispatch => {
  let result = await api.updateOne('program-workouts', workout.program_workout_id, workout);

  if (result) {
    dispatch({
      type: types.UPDATE_PROGRAM_WORKOUT,
      payload: workout,
    });
  }
};

export const clearCurrentProgramWorkout = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAM_WORKOUT,
  });
};

export const clearCurrentProgramWorkouts = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAM_WORKOUTS,
  });
};

export const resetProgramWorkouts = () => async dispatch => {
  dispatch({
    type: types.RESET_PROGRAM_WORKOUTS,
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

export const fetchNextProgramWorkout = programLog => async dispatch => {
  let nextWorkout;

  // let workouts = await api.get('program-workouts', `program_id=1654`);
  let workouts = await api.get(
    'program-workouts',
    `program_id=${programLog.program_id}&orderBy=workout_order`
  );

  let workoutLogs = await api.get(
    'workout-logs',
    `program_log_id=${programLog.program_log_id}&orderBy=workout_order`
  );

  // If starting a new program, set the first workout
  if (workoutLogs.length === 0) {
    nextWorkout = workouts[0];
  } else {
    // Else get the next workout to be done
    for (let i = workouts.length - 1; i >= 0; i--) {
      let thisWorkout = workouts[i];
      if (thisWorkout.workout_order === workoutLogs[workoutLogs.length - 1].workout_order) {
        nextWorkout = workouts[i + 1];
      }
    }
  }

  dispatch({
    type: types.FETCH_NEXT_PROGRAM_WORKOUT,
    payload: nextWorkout,
  });
};

export const setNextProgramWorkout = nextWorkout => dispatch =>
  dispatch({
    type: types.SET_NEXT_PROGRAM_WORKOUT,
    payload: nextWorkout,
  });

export const clearNextProgramWorkout = () => dispatch =>
  dispatch({
    type: types.CLEAR_NEXT_PROGRAM_WORKOUT,
  });
