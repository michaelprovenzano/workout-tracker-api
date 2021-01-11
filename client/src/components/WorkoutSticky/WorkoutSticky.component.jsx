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
import { clearCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { setStats } from '../../redux/stats/stats.actions';

// Components
import Button from '../Button/Button.component';
import LoaderSpinner from 'react-loader-spinner';

const WorkoutSticky = ({
  programLogs: { activeProgramLog },
  workoutLogs: { activeWorkoutLog },
  programWorkouts: { nextProgramWorkout },
  fetchNextProgramWorkout,
  clearNextProgramWorkout,
  skipWorkoutLog,
  addWorkoutLog,
  clearCurrentProgramWorkout,
  clearCurrentWorkoutLog,
  clearCurrentExercises,
  clearActiveWorkoutLog,
  setStats,
}) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);

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
      addWorkoutLog({
        program_log_id: activeProgramLog.program_log_id,
        program_workout_id: nextProgramWorkout.program_workout_id,
        date: new Date(Date.now()),
        skipped: true,
        active: false,
      });
    }

    clearNextProgramWorkout();
  };

  const goToWorkoutLog = () => {
    clearCurrentWorkoutLog();
    clearCurrentExercises();
    clearCurrentProgramWorkout();

    if (!activeWorkoutLog) {
      // If there's no log, create a new workout log for the current program and make it the active workout log
      addWorkoutLog({
        program_workout_id: nextProgramWorkout.program_workout_id,
        program_log_id: activeProgramLog.program_log_id,
        date: new Date(Date.now()),
        skipped: false,
        active: true,
      });
      setRedirect(true);
    } else {
      history.push(`/workout-logs/${activeWorkoutLog.workout_log_id}`);
    }

    // Get the stats to check and update program progress
    // if (stats.progress === 1)
    //   await api.updateOne('program-logs', activeWorkoutLog, { status: 'completed' });
  };
  let loading = false;
  if ((!nextProgramWorkout || Object.keys(nextProgramWorkout).length === 0) && !activeWorkoutLog)
    loading = true;

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
          text={activeWorkoutLog ? 'Continue Workout' : 'Start Workout'}
          position='center'
          type='primary'
          onClick={goToWorkoutLog}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = {
  skipWorkoutLog,
  addWorkoutLog,
  fetchNextProgramWorkout,
  clearNextProgramWorkout,
  clearActiveWorkoutLog,
  clearCurrentProgramWorkout,
  clearCurrentWorkoutLog,
  clearCurrentExercises,
  setStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSticky);
