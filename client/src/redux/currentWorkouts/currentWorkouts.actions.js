import types from './currentWorkouts.types';
import api from '../../utils/apiCalls';

export const setCurrentWorkouts = programId => async dispatch => {
  let workouts = await api.get('program-workouts', `program_id=${programId}&orderBy=workout_order`);

  dispatch({
    type: types.SET_CURRENT_WORKOUTS,
    payload: workouts,
  });
};

export const clearCurrentWorkouts = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_WORKOUTS,
  });
};
