import types from './currentPrograms.types';
import api from '../../utils/apiCalls';

export const setCurrentPrograms = programId => async dispatch => {
  let programs = await api.get('programs');

  dispatch({
    type: types.SET_CURRENT_PROGRAMS,
    payload: programs,
  });
};

export const clearCurrentPrograms = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAMS,
  });
};
