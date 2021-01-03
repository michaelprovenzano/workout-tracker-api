import types from './currentWorkouts.types';
import api from '../../utils/apiCalls';

export const setCurrentWorkouts = programId => async dispatch => {
  let workouts = await api.get('program-workouts', `program_id=${programId}&orderBy=workout_order`);

  dispatch({
    type: types.SET_CURRENT_WORKOUTS,
    payload: workouts,
  });
};

export const addCurrentWorkout = programWorkout => async dispatch => {
  const { workout_name } = programWorkout;
  delete programWorkout.workout_name;

  let workout = await api.addOne('program-workouts', programWorkout);
  workout.workout_name = workout_name;

  if (workout) {
    dispatch({
      type: types.ADD_CURRENT_WORKOUT,
      payload: workout,
    });
  }
};

export const updateCurrentWorkout = programWorkout => async dispatch => {
  let updatedWorkout = await api.updateOne(
    'program-workouts',
    programWorkout.program_workout_id,
    programWorkout
  );

  if (updatedWorkout) {
    dispatch({
      type: types.UPDATE_CURRENT_WORKOUT,
      payload: updatedWorkout,
    });
  }
};

export const updateCurrentWorkouts = workouts => async dispatch => {
  let newWorkouts = await api.patchReq('program-workouts', workouts);
  if (newWorkouts.status === 'success') {
    dispatch({
      type: types.UPDATE_CURRENT_WORKOUTS,
      payload: workouts,
    });
  }
};

export const deleteCurrentWorkout = workoutId => async dispatch => {
  // let newWorkouts = await api.delete('program-workouts', workouts);
  // if (newWorkouts.status === 'success') {
  //   dispatch({
  //     type: types.DELETE_CURRENT_WORKOUT,
  //     payload: workouts,
  //   });
  // }
};

export const clearCurrentWorkouts = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_WORKOUTS,
  });
};
