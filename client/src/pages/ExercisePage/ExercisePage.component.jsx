import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ExercisePage.styles.scss';

// Redux
import { connect } from 'react-redux';
import { setCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import {
  setCurrentProgramWorkout,
  fetchProgramWorkouts,
} from '../../redux/programWorkouts/programWorkouts.actions';
import { setCurrentWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import {
  addExerciseLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  setPreviousExerciseLog,
} from '../../redux/exerciseLogs/exerciseLogs.actions';

// Components
import Header from '../../components/Header/Header.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import ExerciseForm from '../../components/ExerciseForm/ExerciseForm.component';
import PrevNext from '../../components/PrevNext/PrevNext.component';
import Col from '../../components/Col/Col.component';
import LoaderSpinner from 'react-loader-spinner';

const ExercisePage = ({
  activeProgramLog,
  programWorkouts: { currentProgramWorkout, currentProgramWorkouts },
  currentWorkoutLog,
  addExerciseLog,
  currentExerciseLog,
  currentExerciseLogs,
  previousExerciseLog,
  currentExercises,
  setCurrentProgramWorkout,
  setCurrentWorkoutLog,
  setCurrentExercises,
  setCurrentExerciseLog,
  setCurrentExerciseLogs,
  setPreviousExerciseLog,
  match,
}) => {
  let history = useHistory();

  useEffect(() => {
    const workoutLogId = match.params.workoutLogId;
    const exerciseLogId = match.params.exerciseLogId;

    let isCurrentWorkoutLog = false;
    if (currentWorkoutLog)
      isCurrentWorkoutLog = currentWorkoutLog.workout_log_id === parseInt(workoutLogId);

    if (!isCurrentWorkoutLog) {
      setCurrentWorkoutLog(workoutLogId);
      return;
    }

    if (currentProgramWorkouts.length === 0) {
      fetchProgramWorkouts(currentWorkoutLog.program_id);
      return;
    }

    if (currentProgramWorkouts[0].program_workout_id !== currentWorkoutLog.program_workout_id) {
      fetchProgramWorkouts(currentWorkoutLog.program_id);
      return;
    }

    let current = currentProgramWorkouts.find(
      workout => currentWorkoutLog.program_workout_id === workout.program_workout_id
    );

    if (!currentProgramWorkout) {
      setCurrentProgramWorkout(current);
      return;
    }

    if (currentProgramWorkout.program_workout_id !== currentWorkoutLog.program_workout_id) {
      setCurrentProgramWorkout(current);
      return;
    }

    setCurrentExercises(currentProgramWorkout.workout_id);
    setCurrentExerciseLogs(workoutLogId);

    if (currentExerciseLog) {
      setPreviousExerciseLog(currentExerciseLog);
      if (parseInt(exerciseLogId) !== currentExerciseLog.exercise_log_id)
        history.replace(
          `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
        );
    }
    // eslint-disable-next-line
  }, [currentWorkoutLog, currentExerciseLog]);

  const makeActive = workoutExerciseId => {
    let newActiveLog = currentExerciseLogs.find(
      log => log.workout_exercise_id === workoutExerciseId
    );

    if (newActiveLog) {
      history.replace(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${newActiveLog.exercise_log_id}`
      );
      setCurrentExerciseLog(newActiveLog.exercise_log_id);
    } else {
      addExerciseLog(currentWorkoutLog.workout_log_id, workoutExerciseId);
    }
  };

  if (
    !currentExercises ||
    !currentExerciseLogs ||
    !currentExerciseLog ||
    !currentProgramWorkout ||
    !currentProgramWorkouts ||
    !currentWorkoutLog
  )
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  let progress = (currentExerciseLogs.length / currentExercises.length) * 100;
  let currentExercise = currentExercises.find(
    log => log.workout_exercise_id === currentExerciseLog.workout_exercise_id
  );

  return (
    <div className='exercise-page offset-header'>
      <Header
        text={`${currentExercise ? currentExercise.exercise_name || '' : 'Exercise'}`}
        history={history}
      />
      <main className=''>
        <div className='row'>
          <Col number='1' bgSmall='true' className='workout-list'>
            <div className='workout-program d-flex justify-content-between w-100'>
              <div className='pb-2'>{currentProgramWorkout.workout_name}</div>
              <div className='pb-2'>{activeProgramLog.program_name}</div>
            </div>
            <ProgressBar progress={`${progress}`} />
            <div className='hidden-sm-down'>
              {currentExercises.map((exerciseObj, i) => {
                let { exercise_name, is_isometric, has_weight, workout_exercise_id } = exerciseObj;

                let exerciseLogIndex = currentExerciseLogs.findIndex(
                  exerciseLog => exerciseLog.workout_exercise_id === workout_exercise_id
                );

                let complete;
                exerciseLogIndex >= 0 &&
                !(currentExerciseLog.workout_exercise_id === workout_exercise_id)
                  ? (complete = true)
                  : (complete = false);

                return (
                  <ExerciseItem
                    name={`${exercise_name}`}
                    weights={`${has_weight}`}
                    isometric={`${is_isometric}`}
                    key={i}
                    active={currentExerciseLog.workout_exercise_id === workout_exercise_id}
                    complete={complete}
                    onClick={() => makeActive(workout_exercise_id)}
                  />
                );
              })}
            </div>
          </Col>
          <Col number='2' bgLarge='true'>
            <div className='w-100'>
              <h4>Notes from last time:</h4>
              <div className='notes-prev'>
                {previousExerciseLog ? previousExerciseLog.notes : '-'}
              </div>
            </div>
            <header className='table-header row w-100'>
              <div className='col-3 offset-6 p-0 d-flex align-items-center'>Previous</div>
              <div className='col-3 p-0 d-flex align-items-center justify-content-center bold'>
                Current
              </div>
            </header>
            {currentExerciseLog ? (
              <ExerciseForm
                className='w-100'
                exercise={currentExercise || {}}
                currentLog={currentExerciseLog || {}}
                previousLog={previousExerciseLog || {}}
                history={history}
              />
            ) : (
              <div
                className='w-100 d-flex justify-content-center align-items-center'
                style={{ height: '100vh' }}
              >
                <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
              </div>
            )}

            <PrevNext />
          </Col>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  activeProgramLog: state.programLogs.activeProgramLog,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
  currentExerciseLog: state.exerciseLogs.currentExerciseLog,
  currentExerciseLogs: state.exerciseLogs.currentExerciseLogs,
  previousExerciseLog: state.exerciseLogs.previousExerciseLog,
});

const mapDispatchToProps = {
  setCurrentWorkoutLog,
  setCurrentProgramWorkout,
  addExerciseLog,
  setCurrentExercises,
  setCurrentExerciseLog,
  setCurrentExerciseLogs,
  setPreviousExerciseLog,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExercisePage);
