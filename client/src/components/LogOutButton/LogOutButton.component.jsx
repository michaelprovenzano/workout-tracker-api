import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeCurrentUser } from '../../redux/user/user.actions';
import { resetProgramLogs } from '../../redux/programLogs/programLogs.actions';
import { resetWorkoutLogs } from '../../redux/workoutLogs/workoutLogs.actions';
import { resetExerciseLogs } from '../../redux/exerciseLogs/exerciseLogs.actions';
import { resetProgramWorkouts } from '../../redux/programWorkouts/programWorkouts.actions';
import { resetWorkoutExercises } from '../../redux/workoutExercises/workoutExercises.actions';
import { resetPrograms } from '../../redux/programs/programs.actions';
import { resetWorkouts } from '../../redux/workouts/workouts.actions';
import { resetExercises } from '../../redux/exercises/exercises.actions';
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
  resetProgramWorkouts,
  resetWorkoutExercises,
  resetPrograms,
  resetWorkouts,
  resetExercises,
  clearStats,
}) => {
  const history = useHistory();

  const logOut = () => {
    // Reset all of the state
    removeCurrentUser();
    resetProgramLogs();
    resetWorkoutLogs();
    resetExerciseLogs();
    resetProgramWorkouts();
    resetWorkoutExercises();
    resetPrograms();
    resetWorkouts();
    resetExercises();
    clearStats();

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
  resetProgramWorkouts,
  resetWorkoutExercises,
  resetPrograms,
  resetWorkouts,
  resetExercises,
  clearStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogOutButton);
