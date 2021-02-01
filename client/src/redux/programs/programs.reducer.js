import types from './programs.types';

const initialState = {
  currentProgram: null,
  allPrograms: [],
  loading: true,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_PROGRAM:
      return { ...state, allPrograms: [...state.allPrograms, payload], loading: false };
    case types.FETCH_PROGRAMS:
      return { ...state, allPrograms: payload, loading: false };
    case types.CLEAR_PROGRAMS:
      return { ...state, allPrograms: [] };
    case types.SET_CURRENT_PROGRAM:
    case types.UPDATE_CURRENT_PROGRAM:
      return { ...state, currentProgram: payload, loading: false };
    case types.CLEAR_CURRENT_PROGRAM:
      return { ...state, currentProgram: initialState, loading: false };
    case types.SET_PROGRAMS_ERROR:
      return { ...state, error: payload, loading: false };
    case types.RESET_PROGRAMS:
      return { currentProgram: null, allPrograms: [], loading: false, error: null };
    default:
      return state;
  }
};
