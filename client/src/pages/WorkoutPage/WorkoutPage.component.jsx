import React, { useEffect, useState } from 'react';
import './WorkoutPage.styles.scss';

import { connect } from 'react-redux';
import {
  fetchWorkoutExercises,
  setCurrentWorkoutExercise,
} from '../../redux/workoutExercises/workoutExercises.actions';
import {
  fetchProgramWorkouts,
  setCurrentProgramWorkout,
} from '../../redux/programWorkouts/programWorkouts.actions';
import {
  setCurrentWorkoutLog,
  clearCurrentWorkoutLog,
  updateWorkoutLog,
  setPreviousWorkoutLog,
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
import Modal from '../../components/Modal/Modal.component';

import Col from '../../components/Col/Col.component';
import LoaderSpinner from 'react-loader-spinner';

const WorkoutPage = ({
  programLogs: { currentProgramLog },
  workoutLogs: { currentWorkoutLog, previousWorkoutLog },
  exerciseLogs: { currentExerciseLogs, currentExerciseLog },
  programWorkouts: { currentProgramWorkout, currentProgramWorkouts },
  workoutExercises: { currentWorkoutExercises },
  addExerciseLog,
  fetchProgramWorkouts,
  fetchNextProgramWorkout,
  setCurrentProgramWorkout,
  updateWorkoutLog,
  setCurrentWorkoutLog,
  setCurrentWorkoutExercise,
  fetchWorkoutExercises,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  setPreviousWorkoutLog,
  setStats,
  match,
  history,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [modal, setModal] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');

  useEffect(() => {
    const workoutLogId = match.params.workoutLogId;
    let isCurrentLog = false;
    if (currentWorkoutLog)
      isCurrentLog = currentWorkoutLog.workout_log_id === parseInt(workoutLogId);

    if (!isCurrentLog) {
      setCurrentWorkoutLog(workoutLogId);
    } else if (currentProgramWorkouts.length === 0) {
      fetchProgramWorkouts(currentProgramLog.program_id);
    } else if (currentProgramWorkouts[0].program_id !== currentProgramLog.program_id) {
      fetchProgramWorkouts(currentProgramLog.program_id);
    } else if (!currentProgramWorkout) {
      const programWorkout = currentProgramWorkouts.find(
        workout => workout.program_workout_id === currentWorkoutLog.program_workout_id
      );
      setCurrentProgramWorkout(programWorkout);
    } else if (currentProgramWorkout.program_workout_id !== currentWorkoutLog.program_workout_id) {
      const programWorkout = currentProgramWorkouts.find(
        workout => workout.program_workout_id === currentWorkoutLog.program_workout_id
      );
      setCurrentProgramWorkout(programWorkout);
    } else {
      setPreviousWorkoutLog(currentWorkoutLog);
      fetchWorkoutExercises(currentWorkoutLog.workout_id);
      setCurrentExerciseLogs(workoutLogId);
      setStats(currentWorkoutLog.program_log_id);
      setWorkoutNotes(currentWorkoutLog.workout_log_notes || '');
    }

    if (currentExerciseLog && redirect)
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
      );

    // eslint-disable-next-line
  }, [currentWorkoutLog, currentExerciseLog, currentProgramWorkout, currentProgramWorkouts]);

  const goToExerciseLog = (exerciseLogId, workoutExerciseId) => {
    let workoutLogId;
    if (currentWorkoutLog) workoutLogId = currentWorkoutLog.workout_log_id;

    if (currentWorkoutLog && !exerciseLogId) {
      addExerciseLog(workoutLogId, workoutExerciseId);
      setRedirect(true);
    }

    if (currentWorkoutLog && exerciseLogId) {
      setCurrentExerciseLog(
        currentExerciseLogs.find(log => log.exercise_log_id === parseInt(exerciseLogId))
      );
      setCurrentWorkoutExercise(
        currentWorkoutExercises.find(exercise => exercise.workout_exercise_id === workoutExerciseId)
      );
      history.push(`/workout-logs/${currentWorkoutLog.workout_log_id}/${exerciseLogId}`);
    }
  };

  const startOrContinue = () => {
    // If workout has no exercises complete current workout
    if (currentWorkoutExercises.length === 0) {
      updateWorkoutLog(currentWorkoutLog.workout_log_id, { active: false, progress: 1 });
      fetchNextProgramWorkout(currentProgramLog);
      history.push(`/dashboard`);
    } else if (currentExerciseLogs.length === 0) {
      // If workout has no exercise logs, create one and go to it
      addExerciseLog(
        currentWorkoutLog.workout_log_id,
        currentWorkoutExercises[0].workout_exercise_id
      );
      setCurrentWorkoutExercise(currentWorkoutExercises[0]);
      setRedirect(true);
    } else {
      // If workout has exercises, go to last completed exercise log
      const currentLog = currentExerciseLogs[currentExerciseLogs.length - 1];
      setCurrentExerciseLog(currentLog);
      setCurrentWorkoutExercise(
        currentWorkoutExercises.find(
          exercise => exercise.workout_exercise_id === currentLog.workout_exercise_id
        )
      );
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${
          currentExerciseLogs[currentExerciseLogs.length - 1].exercise_log_id
        }`
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
    !currentProgramLog ||
    !currentWorkoutLog ||
    !currentProgramWorkout ||
    !currentWorkoutExercises ||
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
  if (currentWorkoutExercises.length > 0) buttonText = 'Start';
  if (currentExerciseLogs.length > 0) buttonText = 'Continue';

  let { workout_name } = currentProgramWorkout;

  let workoutLength = 1;
  let workoutLogsLength = 1;
  if (currentWorkoutExercises.length > 0) workoutLength = currentWorkoutExercises.length;
  if (currentExerciseLogs.length > 0 && currentWorkoutExercises.length > 0)
    workoutLogsLength = currentExerciseLogs.length;
  let workoutProgress = `${workoutLogsLength}/${workoutLength}`;

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
      <Header text={`${workout_name}`} history={history} />
      <main className=''>
        <div className='row'>
          <Col number='1' bgSmall='true' className='pt-0'>
            <DateInput
              initialDate={currentWorkoutLog.date}
              onInput={date => updateWorkoutLog(currentWorkoutLog.workout_log_id, { date: date })}
            />
            <div className='mb-20px w-100'>
              {currentWorkoutLog ? (
                <ProgressBar progress={currentWorkoutLog.progress * 100} />
              ) : null}
              <div className='workout-program d-flex justify-content-between w-100 pt-2'>
                <div>{workoutProgress}</div>
                <div>{currentProgramLog ? currentProgramLog.program_name : 'null'}</div>
              </div>
            </div>
            <div className='d-flex justify-content-between w-100'>
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
                  className='w-100'
                  onClick={resetSkip}
                />
              )}
              {currentWorkoutLog.progress === 1 ? (
                <Button
                  text='Reset Progress'
                  type='danger'
                  position='center'
                  className='w-100'
                  onClick={resetProgress}
                />
              ) : null}
              {!currentWorkoutLog.skipped && currentWorkoutLog.progress !== 1 ? (
                <Button
                  text={buttonText}
                  type='primary'
                  position='center'
                  className='w-100'
                  onClick={startOrContinue}
                />
              ) : null}
            </div>

            <div className='w-100 mt-5'>
              <hr className='mb-4' />
              <h4 className='mb-2'>Notes from last time:</h4>
              <div className='notes-prev mb-3'>
                {previousWorkoutLog ? previousWorkoutLog.workout_log_notes || '-' : '-'}
              </div>
              <Button
                text='Edit notes for this workout'
                type='secondary'
                className='w-100'
                onClick={() => setModal(true)}
              />
            </div>
            <Modal expanded={modal} width='80%'>
              <div className='modal-close' onClick={() => setModal(false)}>
                &times;
              </div>
              <h4 className='mb-3 mt-5'>Notes for this workout:</h4>
              <textarea
                rows='5'
                className='w-100 mb-4'
                value={workoutNotes}
                onChange={e => setWorkoutNotes(e.target.value)}
              ></textarea>
              <Button
                text='Save'
                type='primary'
                className='w-100'
                onClick={() => {
                  updateWorkoutLog(currentWorkoutLog.workout_log_id, {
                    workout_log_notes: workoutNotes,
                  });
                  setModal(false);
                }}
              />
            </Modal>
          </Col>
          {currentWorkoutExercises.length > 0 ? (
            <Col number='2' bgLarge='true'>
              {currentWorkoutExercises.map((exerciseObj, i) => {
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
  fetchWorkoutExercises,
  setCurrentWorkoutExercise,
  setCurrentProgramWorkout,
  setCurrentWorkoutLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  clearCurrentExerciseLog,
  clearCurrentWorkoutLog,
  setPreviousWorkoutLog,
  setStats,
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPage);
