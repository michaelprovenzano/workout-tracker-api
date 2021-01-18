import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeCurrentUser } from '../../redux/user/user.actions';
import { resetProgramLogs } from '../../redux/programLogs/programLogs.actions';
import { resetWorkoutLogs } from '../../redux/workoutLogs/workoutLogs.actions';
import { resetExerciseLogs } from '../../redux/exerciseLogs/exerciseLogs.actions';
import {
  clearCurrentProgramWorkout,
  clearCurrentProgramWorkouts,
} from '../../redux/programWorkouts/programWorkouts.actions';
import { clearCurrentWorkoutExercises } from '../../redux/workoutExercises/workoutExercises.actions';
import { clearNextProgramWorkout } from '../../redux/programWorkouts/programWorkouts.actions';
import { clearPrograms } from '../../redux/programs/programs.actions';
import { clearStats } from '../../redux/stats/stats.actions';

import './LogOutButton.styles.scss';

const LogOutButton = ({
  position,
  type,
  className,
  collapseMenu,
  user,
  removeCurrentUser,
  resetProgramLogs,
  resetWorkoutLogs,
  resetExerciseLogs,
  clearPrograms,
  clearCurrentProgramWorkout,
  clearCurrentProgramWorkouts,
  clearCurrentWorkoutExercises,
  clearNextProgramWorkout,
  clearStats,
}) => {
  const history = useHistory();

  const logOut = () => {
    // Reset all of the state
    removeCurrentUser();
    resetProgramLogs();
    resetWorkoutLogs();
    resetExerciseLogs();
    clearCurrentProgramWorkout();
    clearCurrentProgramWorkouts();
    clearCurrentWorkoutExercises();
    clearNextProgramWorkout();
    clearStats();
    clearPrograms();

    // Redirect
    history.push('/sign-in');
  };

  return (
    <button
      className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
      onClick={() => {
        logOut();
        collapseMenu();
      }}
    >
      {user.token ? 'Log Out' : 'Sign In'}
    </button>
  );
};

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = {
  removeCurrentUser,
  resetProgramLogs,
  resetWorkoutLogs,
  resetExerciseLogs,
  clearPrograms,
  clearCurrentProgramWorkout,
  clearCurrentProgramWorkouts,
  clearCurrentWorkoutExercises,
  clearNextProgramWorkout,
  clearStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogOutButton);
