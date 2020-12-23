import types from './alerts.types';

export const setAlert = msg => async dispatch => {
  try {
    // Add the user to the state
    dispatch({
      type: types.SET_ALERT,
      payload: msg,
    });

    setTimeout(() => dispatch({ type: types.REMOVE_ALERT, payload: msg }));
  } catch (err) {
    console.log(err.data);
  }
};
