import types from './currentPrograms.types';
import api from '../../utils/apiCalls';

export const addCurrentProgram = program => async dispatch => {
  const newProgram = await api.addOne('programs', program);

  dispatch({
    type: types.ADD_CURRENT_PROGRAM,
    payload: newProgram,
  });
};

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
