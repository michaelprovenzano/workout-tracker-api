import types from './workouts.types';
import api from '../../utils/apiCalls';

export const fetchAllWorkouts = () => async dispatch => {
  const result = await api.get('workouts');
  if (result) {
    dispatch({
      type: types.FETCH_ALL_WORKOUTS,
      payload: result,
    });
  }
};

export const addWorkout = workout => async dispatch => {
  const result = await api.addOne('workouts', workout);
  // let newWorkout = await api.post('workouts', workout);
  if (result) {
    dispatch({
      type: types.ADD_WORKOUT,
      payload: result,
    });
  }
};
