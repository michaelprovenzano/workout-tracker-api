import types from './currentProgram.types';
import api from '../../utils/apiCalls';

export const setCurrentProgram = programId => async dispatch => {
  console.log(programId);
  let program = await api.getOne('programs', programId);

  dispatch({
    type: types.SET_CURRENT_PROGRAM,
    payload: program,
  });
};

export const clearCurrentProgram = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAM,
  });
};
