import types from './programLogs.types';

const INITIAL_STATE = {
  activeProgramLog: null,
  currentProgramLog: null,
  currentProgramLogs: [],
  loading: false,
  error: null,
};

const activeProgramLogReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.GET_ACTIVE_PROGRAM_LOG:
      let log = null;
      if (payload) log = payload;
      return {
        ...state,
        activeProgramLog: log,
        currentProgramLog: log,
      };
    case types.CLEAR_ACTIVE_PROGRAM_LOG:
      return {
        ...state,
        activeProgramLog: null,
      };
    case types.SET_CURRENT_PROGRAM_LOG:
      return {
        ...state,
        currentProgramLog: payload,
      };
    case types.UPDATE_CURRENT_PROGRAM_LOG:
      return {
        currentProgramLog: payload,
        currentProgramLogs: state.currentProgramLogs.map(log =>
          log.program_log_id === payload.program_log_id ? payload : log
        ),
      };
    case types.UPDATE_PROGRAM_LOG:
      return {
        ...state,
        currentProgramLogs: state.currentProgramLogs.map(log =>
          log.program_log_id === payload.program_log_id ? { ...log, ...payload } : log
        ),
      };
    case types.FETCH_PROGRAM_LOGS:
      return { ...state, currentProgramLogs: payload };
    case types.RESET_PROGRAM_LOGS:
      return {
        activeProgramLog: null,
        currentProgramLog: null,
        currentProgramLogs: [],
      };
    case types.SET_PROGRAM_LOGS_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};

export default activeProgramLogReducer;
