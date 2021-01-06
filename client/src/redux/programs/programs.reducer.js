import types from './programs.types';

const initialState = {
  currentProgram: null,
  allPrograms: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ADD_PROGRAM:
      return { ...state, ...payload };

    default:
      return state;
  }
};
