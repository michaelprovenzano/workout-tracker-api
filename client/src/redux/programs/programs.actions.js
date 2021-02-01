import types from './programs.types';
import api from '../../utils/apiCalls';

export const addProgram = program => async dispatch => {
  const result = await api.addOne('programs', program);

  errorCheck(dispatch, result);

  dispatch({
    type: types.ADD_PROGRAM,
    payload: result,
  });
};

export const fetchPrograms = () => async dispatch => {
  let result = await api.get('programs');

  errorCheck(dispatch, result);

  dispatch({
    type: types.FETCH_PROGRAMS,
    payload: result,
  });
};

export const clearPrograms = () => async dispatch => {
  dispatch({
    type: types.CLEAR_PROGRAMS,
  });
};

export const setCurrentProgram = program => async dispatch => {
  dispatch({
    type: types.SET_CURRENT_PROGRAM,
    payload: program,
  });
};

export const updateCurrentProgram = program => async dispatch => {
  const result = await api.updateOne('programs', program.program_id, program);

  errorCheck(dispatch, result);

  if (result.status === 'success') {
    dispatch({
      type: types.UPDATE_PROGRAM,
      payload: program,
    });
  }
};

export const clearCurrentProgram = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_PROGRAM,
  });
};

export const resetPrograms = () => async dispatch => {
  dispatch({
    type: types.RESET_PROGRAMS,
  });
};

const errorCheck = (dispatch, result) => {
  if (result.status === 'fail') {
    dispatch({
      type: types.SET_PROGRAMS_ERROR,
      payload: result.data,
    });
  }
};
