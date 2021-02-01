import types from './workoutExercises.types';
import api from '../../utils/apiCalls';

export const addWorkoutExercise = exercise => async dispatch => {
  let exerciseName;
  if (exercise.exercise_name) exerciseName = exercise.exercise_name;
  delete exercise.exercise_name;

  let result = await api.addOne('workout-exercises', exercise);
  console.log(result);

  errorCheck(dispatch, result);

  result.exercise_name = exerciseName;

  if (result) {
    dispatch({
      type: types.ADD_WORKOUT_EXERCISE,
      payload: result,
    });
  }
};

export const updateWorkoutExercise = exercise => async dispatch => {
  let result = await api.updateOne('workout-exercises', exercise.workout_exercise_id, exercise);

  errorCheck(dispatch, result);

  if (result) {
    dispatch({
      type: types.UPDATE_WORKOUT_EXERCISE,
      payload: exercise,
    });
  }
};

export const deleteWorkoutExercise = exercise => async dispatch => {
  let result = await api.deleteOne('workout-exercises', exercise.workout_exercise_id);

  dispatch({
    type: types.DELETE_WORKOUT_EXERCISE,
    payload: exercise.workout_exercise_id,
  });
};

export const addCurrentWorkoutExercise = exercise => async dispatch => {
  let result = await api.addOne('workout-exercises', exercise);

  errorCheck(dispatch, result);

  if (result) {
    dispatch({
      type: types.ADD_CURRENT_WORKOUT_EXERCISE,
      payload: exercise,
    });
  }
};

export const setCurrentWorkoutExercise = exercise => async dispatch => {
  dispatch({
    type: types.SET_CURRENT_WORKOUT_EXERCISE,
    payload: exercise,
  });
};

export const updateCurrentWorkoutExercise = exercise => async dispatch => {
  let result = await api.updateOne('workout-exercises', exercise.workout_exercise_id, exercise);

  errorCheck(dispatch, result);

  if (result) {
    dispatch({
      type: types.UPDATE_CURRENT_WORKOUT_EXERCISE,
      payload: exercise,
    });
  }
};

export const clearCurrentWorkoutExercise = exercise => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_WORKOUT_EXERCISE,
  });
};

export const fetchWorkoutExercises = workoutId => async dispatch => {
  // Get the exercises for the current workout
  let exercises = await api.get(
    'workout-exercises',
    `workout_id=${workoutId}&orderBy=exercise_order`
  );

  errorCheck(dispatch, exercises);

  dispatch({
    type: types.FETCH_WORKOUT_EXERCISES,
    payload: exercises,
  });
};

export const updateCurrentWorkoutExercises = exercises => async dispatch => {
  let result = await api.patchReq('workout-exercises', exercises);

  errorCheck(dispatch, result);

  if (result.status === 'success') {
    dispatch({
      type: types.UPDATE_CURRENT_WORKOUT_EXERCISES,
      payload: exercises,
    });
  }
};

export const clearCurrentWorkoutExercises = () => ({
  type: types.CLEAR_CURRENT_WORKOUT_EXERCISES,
});

export const resetWorkoutExercises = () => ({
  type: types.RESET_WORKOUT_EXERCISES,
});

// TODO: Implement more robustly after API handles errors more effectively
const errorCheck = (dispatch, result) => {
  if (result.status === 'fail') {
    dispatch({
      type: types.SET_WORKOUT_EXERCISES_ERROR,
      payload: result,
    });
  }
};
