import React, { useEffect, Fragment } from 'react';
import './MyProgramsPage.styles.scss';
import moment from 'moment';

// Redux
import { connect } from 'react-redux';
import {
  fetchProgramLogs,
  getActiveProgramLog,
  abandonProgramLog,
} from '../../redux/programLogs/programLogs.actions';
import { setStats } from '../../redux/stats/stats.actions';
import { setWorkoutLogs } from '../../redux/workoutLogs/workoutLogs.actions';

// Components
import Header from '../../components/Header/Header.component';
import ProgramItem from '../../components/ProgramItem/ProgramItem.component';
import Button from '../../components/Button/Button.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import Col from '../../components/Col/Col.component';
import LoaderSpinner from 'react-loader-spinner';

const MyProgramsPage = ({
  programLogs: { activeProgramLog, currentProgramLogs },
  stats,
  fetchProgramLogs,
  setWorkoutLogs,
  getActiveProgramLog,
  abandonProgramLog,
  setStats,
  history,
}) => {
  useEffect(() => {
    fetchProgramLogs();
    getActiveProgramLog();

    if (stats && activeProgramLog) {
      if (stats.program_log_id !== activeProgramLog.program_log_id)
        setStats(activeProgramLog.program_log_id);
    } else if (!stats && activeProgramLog) {
      setStats(activeProgramLog.program_log_id);
    }
    // eslint-disable-next-line
  }, []);

  const abandonCurrentProgram = async () => {
    abandonProgramLog(activeProgramLog.program_log_id);
    history.push('/dashboard');
  };

  const goToCurrentSchedule = () => {
    history.push(`/program-logs/${activeProgramLog.program_log_id}`);
  };

  const goToProgramLog = programLogId => {
    setWorkoutLogs(programLogId);
    history.push(`/program-logs/${programLogId}`);
  };

  if (!currentProgramLogs)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  return (
    <div className='my-programs-page offset-header'>
      <Header text='My Programs' history={history} />
      <main className=''>
        <div className='row'>
          <Col number='1' bgLarge='true' className='workout-list'>
            {activeProgramLog ? (
              <Fragment>
                <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                  <div className='bold'>{`${activeProgramLog.program_name} | ${activeProgramLog.mode}`}</div>
                  <small>Current Program</small>
                </div>
                <ProgressBar progress={stats ? stats.progress * 100 : 0} />
                <div className='row w-100 btn-group'>
                  <div className='col-4 col-md-12'>
                    <Button
                      text='Abandon'
                      type='danger'
                      position='center'
                      className='w-100'
                      onClick={abandonCurrentProgram}
                    />
                  </div>
                  <div className='col-4 col-md-12'>
                    <Button text='Stats' type='primary' position='center' className='w-100' />
                  </div>
                  <div className='col-4 col-md-12'>
                    <Button
                      text='Schedule'
                      type='primary'
                      position='center'
                      className='w-100'
                      onClick={goToCurrentSchedule}
                    />
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className='workout-program d-flex flex-column align-items-center w-100'>
                <small className='mb-4'>You currently don't have an active program.</small>
                <Button
                  text='Start a new program'
                  type='primary'
                  className='w-100'
                  onClick={() => history.push('/programs')}
                />
              </div>
            )}
          </Col>
          <Col number='2'>
            <header className='header-secondary d-flex align-items-center text-primary w-100'>
              Past Programs
            </header>
            {currentProgramLogs
              ? currentProgramLogs.map((log, i) => {
                  let startDate = moment(log.workout_schedule[0]).format('MM/DD/YYYY');
                  let endDate = moment(
                    log.workout_schedule[log.workout_schedule.length - 1]
                  ).format('MM/DD/YYYY');

                  let abandoned = log.status === 'abandoned';
                  let completed = log.status === 'completed';

                  return (
                    <ProgramItem
                      key={i}
                      name={`${log.program_name} | ${log.mode}`}
                      dateRange={`${startDate} - ${endDate}`}
                      history={history}
                      onClick={() => goToProgramLog(log.program_log_id)}
                      abandoned={abandoned}
                      completed={completed}
                      program
                    />
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
});

export default connect(mapStateToProps, {
  fetchProgramLogs,
  getActiveProgramLog,
  setWorkoutLogs,
  abandonProgramLog,
  setStats,
})(MyProgramsPage);
