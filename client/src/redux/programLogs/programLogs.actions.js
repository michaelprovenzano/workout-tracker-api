import api from '../../utils/apiCalls';
import types from './programLogs.types';

export const getActiveProgramLog = () => async dispatch => {
  const data = await api.get('program-logs', `status=active`);

  dispatch({
    type: types.GET_ACTIVE_PROGRAM_LOG,
    payload: data[0],
  });
};

export const clearActiveProgramLog = () => async dispatch => {
  dispatch({
    type: types.CLEAR_ACTIVE_PROGRAM_LOG,
  });
};

export const abandonProgramLog = id => async dispatch => {
  await api.updateOne('program-logs', id, { status: 'abandoned' });

  dispatch({
    type: types.CLEAR_ACTIVE_PROGRAM_LOG,
  });
};

export const setCurrentProgramLog = logOrId => async dispatch => {
  let log;
  if (typeof logOrId === 'number' || typeof logOrId === 'string') {
    log = await api.getOne('program-logs', logOrId);
  } else {
    log = logOrId;
  }

  dispatch({
    type: types.SET_CURRENT_PROGRAM_LOG,
    payload: log,
  });
};

export const updateCurrentProgramLog = programLog => async dispatch => {
  // await api.updateOne('program-logs', activeWorkoutLog, { status: 'completed' });
  const result = await api.updateOne('program-logs', programLog.program_log_id, programLog);

  dispatchEvent({
    type: types.UPDATE_CURRENT_PROGRAM_LOG,
    payload: programLog,
  });
};

export const updateProgramLog = programLog => async dispatch => {
  const result = await api.updateOne('program-logs', programLog.program_log_id, programLog);
  errorCheck(dispatch, result);

  dispatch({
    type: types.UPDATE_PROGRAM_LOG,
    payload: programLog,
  });
};

export const fetchProgramLogs = () => async dispatch => {
  const logs = await api.get('program-logs', 'orderBy=[desc]start_date');

  dispatch({
    type: types.FETCH_PROGRAM_LOGS,
    payload: logs,
  });
};

export const resetProgramLogs = () => dispatch =>
  dispatch({
    type: types.RESET_PROGRAM_LOGS,
  });

const errorCheck = (dispatch, result) => {
  if (result.status === 'fail') {
    dispatch({
      type: types.SET_PROGRAM_LOGS_ERROR,
      payload: result,
    });
  }
};
