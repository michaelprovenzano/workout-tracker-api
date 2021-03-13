import React, { useEffect, useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import './WorkoutSticky.styles.scss';

// Redux
import { connect } from 'react-redux';
import {
  skipWorkoutLog,
  addWorkoutLog,
  clearCurrentWorkoutLog,
  clearActiveWorkoutLog,
} from '../../redux/workoutLogs/workoutLogs.actions';
import {
  fetchNextProgramWorkout,
  clearNextProgramWorkout,
  clearCurrentProgramWorkout,
} from '../../redux/programWorkouts/programWorkouts.actions';
import { clearCurrentWorkoutExercises } from '../../redux/workoutExercises/workoutExercises.actions';
import {
  updateProgramLog,
  clearActiveProgramLog,
} from '../../redux/programLogs/programLogs.actions';
import { setStats } from '../../redux/stats/stats.actions';

// Components
import Button from '../Button/Button.component';
import LoaderSpinner from 'react-loader-spinner';

const WorkoutSticky = ({
  programLogs: { activeProgramLog },
  workoutLogs: { activeWorkoutLog },
  programWorkouts: { nextProgramWorkout },
  stats,
  updateProgramLog,
  clearActiveProgramLog,
  fetchNextProgramWorkout,
  clearNextProgramWorkout,
  skipWorkoutLog,
  addWorkoutLog,
  clearCurrentProgramWorkout,
  clearCurrentWorkoutLog,
  clearCurrentWorkoutExercises,
  clearActiveWorkoutLog,
  setStats,
}) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (activeWorkoutLog && redirect) {
      history.push(`/workout-logs/${activeWorkoutLog.workout_log_id}`);
    }
    if ((!nextProgramWorkout || Object.keys(nextProgramWorkout).length === 0) && activeProgramLog)
      fetchNextProgramWorkout(activeProgramLog);
    setStats(activeProgramLog.program_log_id);
    // eslint-disable-next-line
  }, [activeProgramLog, activeWorkoutLog, nextProgramWorkout]);

  const skipWorkout = () => {
    if (activeWorkoutLog) {
      skipWorkoutLog(activeWorkoutLog.workout_log_id);
      clearActiveWorkoutLog();
    } else {
      const now = new Date(Date.now());
      addWorkoutLog({
        program_log_id: activeProgramLog.program_log_id,
        program_workout_id: nextProgramWorkout.program_workout_id,
        date: now.toISOString(),
        skipped: true,
        active: false,
      });
    }

    clearNextProgramWorkout();
  };

  const goToWorkoutLog = () => {
    setDisabled(true);
    clearCurrentWorkoutLog();
    clearCurrentWorkoutExercises();
    clearCurrentProgramWorkout();

    if (!activeWorkoutLog) {
      // If there's no log, create a new workout log for the current program and make it the active workout log
      const now = new Date(Date.now());
      addWorkoutLog({
        program_workout_id: nextProgramWorkout.program_workout_id,
        program_log_id: activeProgramLog.program_log_id,
        date: now.toISOString(),
        skipped: false,
        active: true,
      });
      setRedirect(true);
    } else {
      history.push(`/workout-logs/${activeWorkoutLog.workout_log_id}`);
    }
  };

  let loading = false;
  if ((!nextProgramWorkout || Object.keys(nextProgramWorkout).length === 0) && !activeWorkoutLog)
    loading = true;

  let btnText;
  if (disabled) {
    btnText = <LoaderSpinner type='Grid' color='#ffffff' width='20px' height='20px' />;
  } else if (activeWorkoutLog) {
    btnText = 'Continue Workout';
  } else {
    btnText = 'Start Workout';
  }

  return (
    <div className='workout-sticky row'>
      <div className='col-md-8 offset-md-2 col-sm-12 d-flex align-items-center flex-column'>
        <div className='d-flex w-100'>
          <Button
            className='skip-button'
            text='Skip'
            position='left'
            type='secondary'
            onClick={skipWorkout}
          />
        </div>
        {!loading ? (
          <Fragment>
            {activeWorkoutLog ? <small>Today's Workout</small> : <small>Next Workout</small>}
            <h2>
              {activeWorkoutLog ? activeWorkoutLog.workout_name : nextProgramWorkout.workout_name}
            </h2>
          </Fragment>
        ) : (
          <span style={{ padding: '10px' }}>
            <LoaderSpinner type='Grid' width={30} height={30} color='#196cff' />
          </span>
        )}
        <Button
          text={btnText}
          position='center'
          type='primary'
          onClick={goToWorkoutLog}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = {
  updateProgramLog,
  clearActiveProgramLog,
  skipWorkoutLog,
  addWorkoutLog,
  fetchNextProgramWorkout,
  clearNextProgramWorkout,
  clearActiveWorkoutLog,
  clearCurrentProgramWorkout,
  clearCurrentWorkoutLog,
  clearCurrentWorkoutExercises,
  setStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSticky);
