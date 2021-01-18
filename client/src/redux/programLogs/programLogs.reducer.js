import types from './programLogs.types';

const INITIAL_STATE = {
  activeProgramLog: null,
  currentProgramLog: null,
  currentProgramLogs: [],
};

const activeProgramLogReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.GET_ACTIVE_PROGRAM_LOG:
      let log = null;
      if (payload) log = payload;
      return {
        ...state,
        activeProgramLog: log,
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
    case types.FETCH_PROGRAM_LOGS:
      return { ...state, currentProgramLogs: payload };
    case types.RESET_PROGRAM_LOGS:
      return {
        activeProgramLog: null,
        currentProgramLog: null,
        currentProgramLogs: [],
      };
    default:
      return state;
  }
};

export default activeProgramLogReducer;
