import types from './currentExercises.types';
import api from '../../utils/apiCalls';

export const setCurrentExercises = workoutId => async dispatch => {
  // Get the exercises for the current workout
  let exercises = await api.get(
    'workout-exercises',
    `workout_id=${workoutId}&orderBy=exercise_order`
  );

  dispatch({
    type: types.SET_CURRENT_EXERCISES,
    payload: exercises,
  });
};

export const updateCurrentExercises = exercises => async dispatch => {
  let result = await api.patchReq('workout-exercises', exercises);

  if (result.status === 'success') {
    dispatch({
      type: types.UPDATE_CURRENT_EXERCISES,
      payload: exercises,
    });
  }
};

export const updateOneCurrentExercises = exercise => async dispatch => {
  let result = await api.updateOne('exercises', exercise.exercise_id, exercise);

  if (result) {
    dispatch({
      type: types.UPDATE_ONE_CURRENT_EXERCISES,
      payload: exercise,
    });
  }
};

export const clearCurrentExercises = () => ({
  type: types.CLEAR_CURRENT_EXERCISES,
});
