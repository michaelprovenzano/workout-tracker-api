import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ProgressRing from '../ProgressRing/ProgressRing.component';
import StatRing from '../StatRing/StatRing.component';

const DashboardStats = ({ activeProgramLog, stats }) => {
  return (
    <Fragment>
      <div className='d-flex justify-content-end align-items-center align-self-end mb-5'>
        <div className='d-flex flex-column align-items-end progress-text'>
          <h2 className='mt-0'>{activeProgramLog.name}</h2>
          <small>Current Program</small>
        </div>
        {stats && (
          <ProgressRing radius='55' stroke='5' progress={Math.round(stats.progress * 100) || 0} />
        )}
      </div>
      {stats && (
        <Fragment>
          <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
            <StatRing unit='days' quantity={stats.totalCompletedWorkouts} stat='Completed' />
            <StatRing unit='days' quantity={stats.totalRemainingWorkouts} stat='Remaining' />
            <StatRing unit='days' quantity={stats.totalSkippedWorkouts} stat='Skipped' />
          </div>
          <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
            <StatRing unit='days' quantity={stats.currentStreak} stat='Current Streak' />
            <StatRing unit='days' quantity={stats.bestStreak} stat='Best Streak' />
            <StatRing unit='lbs' quantity={stats.totalWeightLifted || 0} stat='Weight Lifted' />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  ...state,
  activeProgramLog: state.programLogs.activeProgramLog,
});

export default connect(mapStateToProps, null)(DashboardStats);
