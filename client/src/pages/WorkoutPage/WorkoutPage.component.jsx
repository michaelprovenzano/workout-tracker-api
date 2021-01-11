import React, { useEffect, useState } from 'react';
import './WorkoutPage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import {
  fetchProgramWorkouts,
  setCurrentProgramWorkout,
} from '../../redux/programWorkouts/programWorkouts.actions';
import {
  setCurrentWorkoutLog,
  clearCurrentWorkoutLog,
  updateWorkoutLog,
} from '../../redux/workoutLogs/workoutLogs.actions';
import {
  addExerciseLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  clearCurrentExerciseLog,
} from '../../redux/exerciseLogs/exerciseLogs.actions';
import { fetchNextProgramWorkout } from '../../redux/programWorkouts/programWorkouts.actions';
import { setStats } from '../../redux/stats/stats.actions';

import Header from '../../components/Header/Header.component';
import Button from '../../components/Button/Button.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import DateInput from '../../components/DateInput/DateInput.component';

import Col from '../../components/Col/Col.component';
import LoaderSpinner from 'react-loader-spinner';

const WorkoutPage = ({
  currentWorkoutLog,
  programLogs: { activeProgramLog },
  programWorkouts: { currentProgramWorkout, currentProgramWorkouts },
  currentExercises,
  currentExerciseLogs,
  currentExerciseLog,
  addExerciseLog,
  fetchProgramWorkouts,
  fetchNextProgramWorkout,
  setCurrentProgramWorkout,
  updateWorkoutLog,
  setCurrentWorkoutLog,
  setCurrentExercises,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  setStats,
  match,
  history,
}) => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const workoutLogId = match.params.workoutLogId;
    let isCurrentLog = false;
    if (currentWorkoutLog)
      isCurrentLog = currentWorkoutLog.workout_log_id === parseInt(workoutLogId);
    if (!isCurrentLog) {
      setCurrentWorkoutLog(workoutLogId);
      return;
    }

    if (currentProgramWorkouts.length === 0) {
      fetchProgramWorkouts(activeProgramLog.program_id);
      return;
    }

    const programWorkout = currentProgramWorkouts.find(
      workout => workout.program_workout_id === currentWorkoutLog.program_workout_id
    );
    setCurrentProgramWorkout(programWorkout);
    setCurrentExercises(currentWorkoutLog.workout_id);
    setCurrentExerciseLogs(workoutLogId);
    setStats(currentWorkoutLog.program_log_id);

    if (currentExerciseLog && redirect)
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
      );

    // eslint-disable-next-line
  }, [currentWorkoutLog, currentExerciseLog, currentProgramWorkouts]);

  const goToExerciseLog = async (exerciseLogId, workoutExerciseId) => {
    let workoutLogId;
    if (currentWorkoutLog) workoutLogId = currentWorkoutLog.workout_log_id;

    if (currentWorkoutLog && !exerciseLogId) {
      addExerciseLog(workoutLogId, workoutExerciseId);
      setRedirect(true);
    }

    if (currentWorkoutLog && exerciseLogId) {
      setCurrentExerciseLog(exerciseLogId);
      history.push(`/workout-logs/${currentWorkoutLog.workout_log_id}/${exerciseLogId}`);
    }
  };

  const startOrContinue = () => {
    // If workout has no exercises complete current workout
    if (currentExercises.length === 0) {
      updateWorkoutLog(currentWorkoutLog.workout_log_id, { active: false, progress: 1 });
      fetchNextProgramWorkout(activeProgramLog);
      history.push(`/dashboard`);
    } else if (currentExerciseLogs.length === 0) {
      // If workout has no exercise logs, create one and go to it
      addExerciseLog(currentWorkoutLog.workout_log_id, currentExercises[0].workout_exercise_id);
      setRedirect(true);
    } else {
      // If workout has exercises, go to last completed exercise log
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
      );
    }
  };

  const resetProgress = () => updateWorkoutLog(currentWorkoutLog.workout_log_id, { progress: 0 });

  const resetSkip = () => updateWorkoutLog(currentWorkoutLog.workout_log_id, { skipped: false });

  const skipWorkout = () => {
    updateWorkoutLog(currentWorkoutLog.workout_log_id, { active: false, skipped: true });
    history.push('/dashboard');
  };

  if (
    !activeProgramLog ||
    !currentWorkoutLog ||
    !currentProgramWorkout ||
    !currentExercises ||
    !currentExerciseLogs
  )
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  let buttonText = 'Mark Complete';
  if (currentExercises.length > 0) buttonText = 'Start';
  if (currentExerciseLogs.length > 0) buttonText = 'Continue';

  let workoutName = '';
  if (currentProgramWorkout) workoutName = currentProgramWorkout.workout_name;

  // // Hash workout logs
  let exerciseLogHash = {};
  if (currentExerciseLogs) {
    currentExerciseLogs.forEach((exerciseLog, i) => {
      exerciseLogHash[exerciseLog.workout_exercise_id] = {
        index: i,
        ...exerciseLog,
      };
    });
  }

  return (
    <div className='workout-page offset-header'>
      <Header text={`${workoutName}`} history={history} />
      <main className=''>
        <div className='row'>
          <Col number='1' bgSmall='true'>
            <div className='d-flex justify-content-start mb-20px w-100'>
              {!currentWorkoutLog.skipped ? (
                <Button
                  text='Skip'
                  type='secondary'
                  position='left'
                  className='w-50'
                  onClick={skipWorkout}
                />
              ) : (
                <Button
                  text='Undo Skip'
                  type='danger'
                  position='center'
                  className='w-100 mb-20px'
                  onClick={resetSkip}
                />
              )}
            </div>
            {currentWorkoutLog.progress === 1 ? (
              <Button
                text='Reset Workout Progress'
                type='danger'
                position='center'
                className='w-100 mb-20px'
                onClick={resetProgress}
              />
            ) : null}
            {!currentWorkoutLog.skipped && currentWorkoutLog.progress !== 1 ? (
              <Button
                text={buttonText}
                type='primary'
                position='center'
                className='w-100 mb-20px'
                onClick={startOrContinue}
              />
            ) : null}
            <div className='workout-program d-flex justify-content-between w-100'>
              <div className='pb-2'>{workoutName}</div>
              <div className='pb-2'>
                {activeProgramLog ? activeProgramLog.program_name : 'null'}
              </div>
            </div>
            {currentWorkoutLog ? <ProgressBar progress={currentWorkoutLog.progress * 100} /> : null}
            <DateInput
              initialDate={currentWorkoutLog.date}
              onInput={date => updateWorkoutLog(currentWorkoutLog.workout_log_id, { date: date })}
            />
          </Col>
          {currentExercises.length > 0 ? (
            <Col number='2' bgLarge='true'>
              {currentExercises.map((exerciseObj, i) => {
                let { exercise_name, is_isometric, has_weight, workout_exercise_id } = exerciseObj;
                let hasLog = exerciseLogHash[exerciseObj.workout_exercise_id];

                let logId;
                if (hasLog) logId = hasLog.exercise_log_id;

                return (
                  <ExerciseItem
                    name={`${exercise_name}`}
                    weights={`${has_weight}`}
                    isometric={`${is_isometric}`}
                    key={i}
                    onClick={() => goToExerciseLog(logId, workout_exercise_id)}
                    complete={hasLog}
                  />
                );
              })}
            </Col>
          ) : (
            <Col number='2' bgLarge='true'>
              <p className='text-primary'>
                Nothing specific to track here! Just sweat it out and when you're finished mark it
                complete!
              </p>
            </Col>
          )}
        </div>
      </main>
    </div>
  );
};

const mapDispatchToProps = {
  addExerciseLog,
  updateWorkoutLog,
  fetchProgramWorkouts,
  fetchNextProgramWorkout,
  setCurrentExercises,
  setCurrentProgramWorkout,
  setCurrentWorkoutLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  clearCurrentExerciseLog,
  clearCurrentWorkoutLog,
  setStats,
};

const mapStateToProps = state => ({
  ...state,
  activeProgramLog: state.programLogs.activeProgramLog,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
  currentExercises: state.currentExercises,
  currentExerciseLog: state.exerciseLogs.currentExerciseLog,
  currentExerciseLogs: state.exerciseLogs.currentExerciseLogs,
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPage);
