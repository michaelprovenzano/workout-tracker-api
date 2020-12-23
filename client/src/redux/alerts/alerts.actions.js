import types from './alerts.types';

export const setAlert = (type, message, timeout = 5000) => async dispatch => {
  try {
    // Add the user to the state
    dispatch({
      type: types.SET_ALERT,
      payload: { type, message },
    });

    setTimeout(() => dispatch({ type: types.REMOVE_ALERT, payload: message }), timeout);
  } catch (err) {
    console.log(err.data);
  }
};
