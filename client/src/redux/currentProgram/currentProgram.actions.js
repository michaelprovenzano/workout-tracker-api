import types from './currentProgram.types';
import api from '../../utils/apiCalls';

export const setCurrentProgram = program => async dispatch => {
  dispatch({
    type: types.SET_CURRENT_PROGRAM,
    payload: program,
  });
};

export const updateCurrentProgram = program => async dispatch => {
  console.log(program.program_id);
  const result = await api.updateOne('programs', program.program_id, program);

  if (result.status === 'success') {
    dispatch({
      type: types.UPDATE_CURRENT_PROGRAM,
      payload: program,
    });
  }
};

export const clearCurrentProgram = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAM,
  });
};
