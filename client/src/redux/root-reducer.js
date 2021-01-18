import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import programLogsReducer from './programLogs/programLogs.reducer';
import programsReducer from './programs/programs.reducer';
import programWorkouts from './programWorkouts/programWorkouts.reducer';
import workoutLogsReducer from './workoutLogs/workoutLogs.reducer';
import workoutsReducer from './workouts/workouts.reducer';
import workoutExercisesReducer from './workoutExercises/workoutExercises.reducer';
import exercisesReducer from './exercises/exercises.reducer';
import exerciseLogsReducer from './exerciseLogs/exerciseLogs.reducer';
import statsReducer from './stats/stats.reducer';
import alertsReducer from './alerts/alerts.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'programLogs',
    'workoutLogs',
    'exerciseLogs',
    'programs',
    'programWorkouts',
    'workoutExercises',
    'workouts',
    'exercises',
    'stats',
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  programLogs: programLogsReducer,
  workoutLogs: workoutLogsReducer,
  exerciseLogs: exerciseLogsReducer,
  programs: programsReducer,
  programWorkouts: programWorkouts,
  workouts: workoutsReducer,
  workoutExercises: workoutExercisesReducer,
  exercises: exercisesReducer,
  stats: statsReducer,
  alerts: alertsReducer,
});

export default persistReducer(persistConfig, rootReducer);
