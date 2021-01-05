import types from './currentExercise.types';
import api from '../../utils/apiCalls';

export const setCurrentExercise = exercise => async dispatch => {
  dispatch({
    type: types.SET_CURRENT_EXERCISE,
    payload: exercise,
  });
};

export const updateCurrentExercise = exercise => async dispatch => {
  let result = await api.updateOne('exercises', exercise.exercise_id, exercise);

  if (result) {
    dispatch({
      type: types.UPDATE_CURRENT_EXERCISE,
      payload: exercise,
    });
  }
};

export const clearCurrentExercise = () => ({
  type: types.CLEAR_CURRENT_EXERCISE,
});
