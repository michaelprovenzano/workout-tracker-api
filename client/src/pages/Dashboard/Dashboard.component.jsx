import React, { useEffect } from 'react';
import './Dashboard.styles.scss';

// Redux
import { connect } from 'react-redux';
import {
  setWorkoutLogs,
  getActiveWorkoutLog,
  clearCurrentWorkoutLog,
} from '../../redux/workoutLogs/workoutLogs.actions';
import {
  getActiveProgramLog,
  updateProgramLog,
  clearActiveProgramLog,
} from '../../redux/programLogs/programLogs.actions';
import { fetchNextProgramWorkout } from '../../redux/programWorkouts/programWorkouts.actions';
import { clearStats, setStats } from '../../redux/stats/stats.actions';

// Components
import Header from '../../components/Header/Header.component';
import DashboardStats from '../../components/DashboardStats/DashboardStats.component';
import ProgressCalendar from '../../components/ProgressCalendar/ProgressCalendar.component';
import WorkoutSticky from '../../components/WorkoutSticky/WorkoutSticky.component';
import LoaderSpinner from 'react-loader-spinner';

import Col from '../../components/Col/Col.component';
import Button from '../../components/Button/Button.component';

const Dashboard = ({
  user,
  programLogs: { activeProgramLog },
  programWorkouts: { nextProgramWorkout },
  stats,
  updateProgramLog,
  getActiveProgramLog,
  clearActiveProgramLog,
  setWorkoutLogs,
  getActiveWorkoutLog,
  clearCurrentWorkoutLog,
  fetchNextProgramWorkout,
  setStats,
  clearStats,
  history,
}) => {
  useEffect(() => {
    getActiveProgramLog();

    if (activeProgramLog) {
      let id = activeProgramLog.program_log_id;
      setWorkoutLogs(id);
      getActiveWorkoutLog(id);
      clearCurrentWorkoutLog();
      fetchNextProgramWorkout(activeProgramLog); // Will not update if opened on different device
      setStats(id);
    } else {
      clearStats();
    }
    // eslint-disable-next-line
  }, []);

  const browsePrograms = async () => {
    history.push('/programs');
  };

  if (!user)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  // Get the stats to check and update program progress
  if (stats.progress >= 1 && activeProgramLog) {
    updateProgramLog({ ...activeProgramLog, status: 'completed' });
    clearActiveProgramLog();
    clearStats();
  }

  return (
    <div className='offset-header'>
      <Header text='Dashboard' />
      {activeProgramLog ? <WorkoutSticky nextWorkout={nextProgramWorkout} /> : null}

      <main className='content dashboard'>
        {activeProgramLog ? (
          <div className='row'>
            <Col number='1'>
              <DashboardStats />
            </Col>
            <Col number='2'>{stats && <ProgressCalendar calendar={stats.calendar} />}</Col>
          </div>
        ) : (
          <div className='row'>
            <div className='empty-state col-md-6 offset-md-3 d-flex flex-column align-items-center justify-content-center'>
              <h4 className='text-12 text-primary bold pb-4'>Let's Get Started!</h4>
              <p className='text-12 text-primary pb-4'>
                Don’t be shy! It’s time to flex your muscles and show yourself what you’re made of.
                Select a program!
              </p>
              <Button
                text='Start a new program'
                type='primary'
                className='w-100'
                onClick={browsePrograms}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = {
  setWorkoutLogs,
  updateProgramLog,
  getActiveProgramLog,
  clearActiveProgramLog,
  getActiveWorkoutLog,
  clearCurrentWorkoutLog,
  fetchNextProgramWorkout,
  setStats,
  clearStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
