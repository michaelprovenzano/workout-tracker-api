import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProgressCalendar.styles.scss';

const ProgressCalendar = ({ calendar }) => {
  if (!calendar) calendar = [];
  return (
    <div className='progress-calendar'>
      <div className='calendar'>
        {calendar.map((item, i) => (
          <div className='calendar-day-container' key={i}>
            {item.workout_log_id ? (
              <Link
                to={item.workout_log_id ? `/workout-logs/${item.workout_log_id}` : ''}
                className={`calendar-day ${item.skipped ? 'skipped' : ''} ${
                  item.complete && !item.skipped ? 'complete' : ''
                } ${item.streak ? 'streak' : ''}`}
              >
                <div className='calendar-day-text text-16'>{i + 1}</div>
              </Link>
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
  calendar: state.stats.calendar,
});

export default connect(mapStateToProps, null)(ProgressCalendar);
