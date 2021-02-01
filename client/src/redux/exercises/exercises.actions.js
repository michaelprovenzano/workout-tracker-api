import types from './exercises.types';
import api from '../../utils/apiCalls';

export const addExercise = exercise => async dispatch => {
  let result = await api.addOne('exercises', exercise);

  errorCheck(dispatch, result);

  dispatch({
    type: types.ADD_EXERCISE,
    payload: exercise,
  });
};

export const updateExercise = exercise => async dispatch => {
  let result = await api.updateOne('exercises', exercise.exercise_id, exercise);

  errorCheck(dispatch, result);

  dispatch({
    type: types.UPDATE_EXERCISE,
    payload: exercise,
  });
};

export const addCurrentExercise = exercise => async dispatch => {
  let result = await api.addOne('exercises', exercise);

  errorCheck(dispatch, result);

  dispatch({
    type: types.ADD_CURRENT_EXERCISE,
    payload: exercise,
  });
};

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

export const fetchAllExercises = () => async dispatch => {
  let result = await api.get('exercises');

  if (result) {
    dispatch({
      type: types.FETCH_ALL_EXERCISES,
      payload: result,
    });
  }
};

export const clearAllExercises = () => ({
  type: types.CLEAR_ALL_EXERCISES,
});

export const resetExercises = () => ({
  type: types.RESET_EXERCISES,
});

// TODO: Implement more robustly after API handles errors more effectively
const errorCheck = (dispatch, result) => {
  if (result.status === 'fail') {
    dispatch({
      type: types.SET_EXERCISES_ERROR,
      payload: result,
    });
  }
};
