import React from 'react';
import { useHistory } from 'react-router-dom';
import './PrevNext.styles.scss';

import { connect } from 'react-redux';
import {
  addExerciseLog,
  setCurrentExerciseLog,
  clearCurrentExerciseLog,
  clearCurrentExerciseLogs,
} from '../../redux/exerciseLogs/exerciseLogs.actions';
import { clearCurrentWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';

import Arrow from '../Arrow/Arrow.component';
import { clearCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { clearCurrentProgramWorkout } from '../../redux/programWorkouts/programWorkouts.actions';

const PrevNext = ({
  className,
  addExerciseLog,
  clearCurrentProgramWorkout,
  clearCurrentWorkoutLog,
  clearCurrentExerciseLog,
  clearCurrentExerciseLogs,
  currentWorkoutLog,
  currentExercises,
  currentExerciseLog,
  currentExerciseLogs,
  setCurrentExerciseLog,
}) => {
  let history = useHistory();

  const lastExerciseId = currentExercises[currentExercises.length - 1].workout_exercise_id;
  const currentExerciseLogId = currentExerciseLog.workout_exercise_id;
  let lastExercise =
    currentExerciseLogId === lastExerciseId &&
    currentExerciseLogs.length === currentExercises.length;

  console.log({ lastExerciseId, currentExerciseLogId });

  console.log(lastExercise);

  const getNextPrevExercise = direction => {
    if (lastExercise && direction === 'next') {
      clearCurrentExerciseLog();
      clearCurrentExerciseLogs();
      clearCurrentExercises();
      clearCurrentWorkoutLog();
      clearCurrentProgramWorkout();

      history.push('/dashboard');
    } else {
      const currentExerciseIndex = currentExercises.findIndex(
        exercise => exercise.workout_exercise_id === currentExerciseLog.workout_exercise_id
      );

      let index;
      if (direction === 'next') index = currentExerciseIndex + 1;
      if (direction === 'prev') index = currentExerciseIndex - 1;
      if (!currentExercises[index]) return;

      const nextWorkoutExerciseId = currentExercises[index].workout_exercise_id;
      const nextWorkoutLog = currentExerciseLogs.find(
        log => log.workout_exercise_id === nextWorkoutExerciseId
      );

      if (nextWorkoutLog) {
        setCurrentExerciseLog(nextWorkoutLog);
      } else {
        addExerciseLog(currentWorkoutLog.workout_log_id, nextWorkoutExerciseId);
      }
    }
  };

  return (
    <div className={`prev-next w-100 d-flex align-items-center row ${className ? className : ''}`}>
      <div className='col-6 col-lg-4 offset-lg-2 h-100'>
        <button
          className='prev h-100 w-100 m-0 d-flex justify-content-start align-items-center'
          onClick={() => getNextPrevExercise('prev')}
        >
          <Arrow direction='left' />
          <span className='btn-text'>Prev</span>
        </button>
      </div>
      <div className='col-6 col-lg-4 h-100'>
        <button
          className='prev h-100 w-100 m-0 d-flex justify-content-end align-items-center'
          onClick={() => getNextPrevExercise('next')}
        >
          <span className='btn-text'>{lastExercise ? 'Finish' : 'Next'}</span>
          {lastExercise ? null : <Arrow direction='right' />}
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
  currentExercises: state.currentExercises,
  currentExerciseLog: state.exerciseLogs.currentExerciseLog,
  currentExerciseLogs: state.exerciseLogs.currentExerciseLogs,
});

export default connect(mapStateToProps, {
  addExerciseLog,
  clearCurrentExerciseLog,
  clearCurrentExerciseLogs,
  clearCurrentWorkoutLog,
  clearCurrentProgramWorkout,
  setCurrentExerciseLog,
})(PrevNext);
