import React, { useEffect, useState } from 'react';
import './DateInput.styles.scss';

import moment from 'moment';

const DateInput = ({ onInput, initialDate }) => {
  const [date, setDate] = useState(null);
  const [month, setMonth] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Fix postgres Date object auto-injecting timezone in development
    initialDate = initialDate.split('T')[0] + 'T00:00:00.000Z';

    window.addEventListener('click', handleExpanded);
    if (!date) setDate(moment(initialDate).utc());
    if (!month) setMonth(moment(initialDate).utc());

    console.log(moment(initialDate).format('MMMM M/D/YY'));

    return () => window.removeEventListener('click', handleExpanded);
    // eslint-disable-next-line
  }, [date, month, initialDate]);

  const createCalendar = () => {
    let thisDate = moment(date);
    if (!month) setMonth(moment(thisDate).toDate());
    let thisMonth = moment(month);

    let daysInMonth = thisMonth.daysInMonth();
    let daysInPrevMonth = moment(thisMonth).subtract(1, 'month').daysInMonth();
    let calendarData = [];

    let startOfMonth = thisMonth.startOf('month');

    let disabledCellsStart = startOfMonth.weekday();

    for (let i = 0; i < disabledCellsStart; i++) {
      calendarData.push({
        active: false,
        day: daysInPrevMonth - i,
      });
    }

    for (let i = 0; i < daysInMonth; i++) {
      calendarData.push({
        active: true,
        day: i + 1,
      });
    }

    let disabledCellsEnd = 42 - daysInMonth - disabledCellsStart;
    for (let i = 0; i < disabledCellsEnd; i++) {
      calendarData.push({
        active: false,
        day: i + 1,
      });
    }

    setCalendar(calendarData);
  };

  const changeMonth = direction => {
    if (direction === 'prev') setMonth(moment(month).subtract(1, 'month').toDate());
    if (direction === 'next') setMonth(moment(month).add(1, 'month').toDate());
    setCalendar(null);
  };

  const makeActive = day => {
    if (!day.active) return;
    setDate(moment(month).date(day.day));
    setExpanded(false);
    if (onInput) onInput(moment(month).date(day.day));
  };

  const handleExpanded = e => {
    if (
      e.target.closest('.date-picker') &&
      (!e.target.closest('.popup-day') || e.target.closest('.disabled'))
    ) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  if (!date || !month) return <div>Loading...</div>;
  if (!calendar) createCalendar();

  return (
    <div className='date-picker w-100'>
      <input
        type='text'
        className='date-picker-input btn w-100 text-center mt-1'
        value={date.utc().format('MMMM M/D/YY')}
        readOnly='true'
      />
      <div className={`popup-container w-100 ${!expanded ? 'hidden' : ''}`}>
        <div className='popup w-100'>
          <div className='popup-header w-100'>
            <button className='btn btn-primary' onClick={() => changeMonth('prev')}>
              &laquo;
            </button>
            <div className='d-flex flex-column align-items-center'>
              <h3>{moment(month).format('MMMM')}</h3>
              <small>{moment(month).format('yyyy')}</small>
            </div>
            <button className='btn btn-primary' onClick={() => changeMonth('next')}>
              &raquo;
            </button>
          </div>
          <div className='popup-calendar'>
            <ul className='popup-calendar-header'>
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <div className='popup-calendar-body'>
              {calendar &&
                calendar.map((day, i) => (
                  <div key={i} className='popup-day-container'>
                    <div
                      className={`popup-day ${
                        moment(month).date(day.day).isSame(moment(date), 'day') && day.active
                          ? 'active'
                          : ''
                      } ${!day.active ? 'disabled' : ''}`}
                      onClick={() => makeActive(day)}
                    >
                      <span className='popup-date'>{day.day}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateInput;
