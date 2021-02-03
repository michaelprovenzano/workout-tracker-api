import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProgressCalendar.styles.scss';

import { setCurrentWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import { setCurrentWorkoutExercise } from '../../redux/workoutExercises/workoutExercises.actions';

const ProgressCalendar = ({
  workoutLogs: { currentWorkoutLogs },
  stats: { calendar },
  setCurrentWorkoutLog,
}) => {
  const history = useHistory();

  const goToWorkoutLog = calendarItem => {
    if (calendarItem.workout_log_id) {
      history.push(`/workout-logs/${calendarItem.workout_log_id}`);
      setCurrentWorkoutLog(
        currentWorkoutLogs.find(log => log.workout_log_id === calendarItem.workout_log_id)
      );
    }
  };

  if (!calendar) calendar = [];
  return (
    <div className='progress-calendar'>
      <div className='calendar'>
        {calendar.map((item, i) => (
          <div className='calendar-day-container' key={i}>
            {item.workout_log_id ? (
              <button
                className={`calendar-day ${item.skipped ? 'skipped' : ''} ${
                  item.complete && !item.skipped ? 'complete' : ''
                } ${item.streak ? 'streak' : ''}`}
                onClick={() => goToWorkoutLog(item)}
              >
                <div className='calendar-day-text text-16'>{i + 1}</div>
              </button>
            ) : (
              <div
                className={`calendar-day ${item.skipped ? 'skipped' : ''} ${
                  item.complete && !item.skipped ? 'complete' : ''
                } ${item.streak ? 'streak' : ''}`}
              >
                <div className='calendar-day-text text-16'>{i + 1}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, { setCurrentWorkoutLog })(ProgressCalendar);
