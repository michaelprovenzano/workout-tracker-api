import types from './currentPrograms.types';
import api from '../../utils/apiCalls';

export const setCurrentPrograms = programId => async dispatch => {
  let workouts = await api.get('program-workouts', `program_id=${programId}&orderBy=workout_order`);

  dispatch({
    type: types.SET_CURRENT_PROGRAMS,
    payload: workouts,
  });
};

export const clearCurrentPrograms = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAMS,
  });
};
