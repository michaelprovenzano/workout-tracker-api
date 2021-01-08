import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import programLogsReducer from './programLogs/programLogs.reducer';
import nextWorkoutReducer from './nextWorkout/nextWorkout.reducer';
import programsReducer from './programs/programs.reducer';
import currentWorkoutReducer from './currentWorkout/currentWorkout.reducer';
import currentWorkoutsReducer from './currentWorkouts/currentWorkouts.reducer';
import programWorkouts from './programWorkouts/programWorkouts.reducer';
import currentExercisesReducer from './currentExercises/currentExercises.reducer';
import currentExerciseReducer from './currentExercise/currentExercise.reducer';
import workoutLogsReducer from './workoutLogs/workoutLogs.reducer';
import workoutsReducer from './workouts/workouts.reducer';
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
    'currentWorkout',
    'currentWorkouts',
    'programWorkouts',
    'currentExercise',
    'currentExercises',
    'workouts',
    'nextWorkout',
    'stats',
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  programLogs: programLogsReducer,
  workoutLogs: workoutLogsReducer,
  exerciseLogs: exerciseLogsReducer,
  programs: programsReducer,
  currentWorkout: currentWorkoutReducer,
  currentWorkouts: currentWorkoutsReducer,
  programWorkouts: programWorkouts,
  currentExercise: currentExerciseReducer,
  currentExercises: currentExercisesReducer,
  workouts: workoutsReducer,
  nextWorkout: nextWorkoutReducer,
  stats: statsReducer,
  alerts: alertsReducer,
});

export default persistReducer(persistConfig, rootReducer);
