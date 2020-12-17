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

export const clearCurrentExercises = () => ({
  type: types.CLEAR_CURRENT_EXERCISES,
});
