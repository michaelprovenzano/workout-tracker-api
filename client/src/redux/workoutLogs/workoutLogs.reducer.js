import types from './workoutLogs.types';

const INITIAL_STATE = {
  activeWorkoutLog: null,
  currentWorkoutLog: null,
  currentWorkoutLogs: [],
};

const workoutLogsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_WORKOUT_LOG:
      return {
        ...state,
        activeWorkoutLog: action.payload.skipped || !action.payload.active ? null : action.payload,
        currentWorkoutLog: action.payload,
        currentWorkoutLogs: [...state.currentWorkoutLogs, action.payload],
      };
    case types.UPDATE_WORKOUT_LOG:
      let activeWorkoutLog = null;
      if (state.activeWorkoutLog) {
        state.activeWorkoutLog.workout_log_id === action.payload.workout_log_id
          ? (activeWorkoutLog = action.payload)
          : (activeWorkoutLog = state.activeWorkoutLog);
      }
      return {
        ...state,
        activeWorkoutLog: activeWorkoutLog,
        currentWorkoutLog: action.payload,
        currentWorkoutLogs: state.currentWorkoutLogs.map(log =>
          log.workout_log_id === action.payload.workout_log_id ? action.payload : log
        ),
      };
    case types.SET_WORKOUT_LOGS:
      return {
        ...state,
        currentWorkoutLogs: action.payload,
      };
    case types.GET_ACTIVE_WORKOUT_LOG:
      return {
        ...state,
        activeWorkoutLog: action.payload,
      };
    case types.CLEAR_ACTIVE_WORKOUT_LOG:
      return {
        ...state,
        activeWorkoutLog: null,
      };
    case types.SKIP_WORKOUT_LOG:
      if (state.currentWorkoutLogs)
        return {
          ...state,
          currentWorkoutLogs: {
            activeWorkoutLog: null,
            currentWorkoutLogs: state.currentWorkoutLogs.map(log =>
              log.workout_log_id !== action.payload ? log : action.payload
            ),
          },
        };
      break;
    case types.SET_CURRENT_WORKOUT_LOG:
      return {
        ...state,
        currentWorkoutLog: action.payload,
      };
    case types.CLEAR_CURRENT_WORKOUT_LOG:
      return {
        ...state,
        currentWorkoutLog: null,
      };
    case types.RESET_WORKOUT_LOGS:
      return { activeWorkoutLog: null, currentWorkoutLog: null, currentWorkoutLogs: [] };
    default:
      return state;
  }
};

export default workoutLogsReducer;
