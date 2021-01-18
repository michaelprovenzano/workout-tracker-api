import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './MySchedulePage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentProgramLog } from '../../redux/programLogs/programLogs.actions';
import { setWorkoutLogs, setCurrentWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import {
  fetchProgramWorkouts,
  setCurrentProgramWorkout,
} from '../../redux/programWorkouts/programWorkouts.actions';
import { clearCurrentWorkoutExercises } from '../../redux/workoutExercises/workoutExercises.actions';
import { setStats } from '../../redux/stats/stats.actions';

import moment from 'moment';

// Components
import Header from '../../components/Header/Header.component';
import ProgramItem from '../../components/ProgramItem/ProgramItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import Col from '../../components/Col/Col.component';
import LoaderSpinner from 'react-loader-spinner';

const MySchedulePage = ({
  stats,
  match,
  programLog,
  currentWorkoutLog,
  currentWorkoutLogs,
  programWorkouts: { currentProgramWorkouts },
  setWorkoutLogs,
  setCurrentProgramLog,
  setCurrentWorkoutLog,
  fetchProgramWorkouts,
  setCurrentProgramWorkout,
  clearCurrentWorkoutExercises,
  setStats,
}) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    clearCurrentWorkoutExercises();
    const programLogId = match.params.programLogId;
    let isCurrentProgramLog = false;
    if (programLog) isCurrentProgramLog = programLog.program_log_id === parseInt(programLogId);

    if (!isCurrentProgramLog) {
      setCurrentProgramLog(programLogId);
      setWorkoutLogs(programLogId);
    } else {
      fetchProgramWorkouts(programLog.program_id);
    }

    if (currentWorkoutLog && redirect)
      history.push(`/workout-logs/${currentWorkoutLog.workout_log_id}`);
    if (stats.program_log_id !== programLogId) setStats(programLogId);
    // eslint-disable-next-line
  }, [programLog, currentWorkoutLogs, stats, redirect]);

  const goToWorkoutLog = async (e, log) => {
    let clickedLog;
    if (log)
      clickedLog = currentWorkoutLogs.find(
        item => item.program_workout_id === log.program_workout_id
      );

    if (clickedLog) {
      const programWorkout = currentProgramWorkouts.find(
        workout => workout.program_workout_id === log.program_workout_id
      );
      setCurrentWorkoutLog(log);
      setCurrentProgramWorkout(programWorkout);
      setRedirect(true);
    }
  };

  if (!programLog || !currentWorkoutLogs || !currentProgramWorkouts)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  let currentWorkoutDate;
  if (programLog) currentWorkoutDate = moment(programLog.start_date);

  // Hash workout logs
  let workoutLogHash = {};
  if (currentWorkoutLogs) {
    currentWorkoutLogs.forEach((workoutLog, i) => {
      workoutLogHash[workoutLog.program_workout_id] = {
        index: i,
        ...workoutLog,
      };
    });
  }

  return (
    <div className='my-programs-page offset-header'>
      <Header text='My Schedule' history={history} />
      <main className=''>
        <div className='row'>
          <Col number='1' bgLarge='true' className='workout-list'>
            {programLog ? (
              <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                <div className='bold'>{programLog.program_name}</div>
                {programLog.status === 'active' ? <small>Current Program</small> : null}
              </div>
            ) : null}
            <ProgressBar progress={stats ? stats.progress * 100 : 0} />
          </Col>
          <Col number='2'>
            {currentProgramWorkouts
              ? currentProgramWorkouts.map((workout, i) => {
                  let status, workout_log_id;

                  let increment = 1;
                  if (i === 0) increment = 0;
                  currentWorkoutDate = moment(currentWorkoutDate)
                    .add(increment, 'days')
                    .format('MM/DD/YYYY');

                  let log;
                  if (workoutLogHash[workout.program_workout_id]) {
                    log = workoutLogHash[workout.program_workout_id];
                    let index = log.index;
                    workout_log_id = log.workout_log_id;
                    currentWorkoutLogs[index].skipped
                      ? (status = 'skipped')
                      : (status = 'completed');
                    currentWorkoutDate = moment(log.date).format('MM/DD/YYYY');
                  }

                  return (
                    <div className='w-100 d-flex flex-column align-items-center' key={i}>
                      {i % 7 === 0 ? (
                        <header className='header-secondary w-100 d-flex align-items-center text-primary'>
                          Week {(i + 7) / 7}
                        </header>
                      ) : null}
                      <ProgramItem
                        key={i}
                        id={i}
                        name={workout.workout_name}
                        date={currentWorkoutDate}
                        completed={status === 'completed'}
                        skipped={status === 'skipped'}
                        history={history}
                        url={`/workout-logs/${workout_log_id}`}
                        onClick={e => goToWorkoutLog(e, log)}
                        workout
                      />
                    </div>
                  );
                })
              : null}
          </Col>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  programLog: state.programLogs.currentProgramLog,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
  currentWorkoutLogs: state.workoutLogs.workoutLogs,
});

export default connect(mapStateToProps, {
  setCurrentProgramLog,
  fetchProgramWorkouts,
  clearCurrentWorkoutExercises,
  setCurrentProgramWorkout,
  setWorkoutLogs,
  setCurrentWorkoutLog,
  setStats,
})(MySchedulePage);
