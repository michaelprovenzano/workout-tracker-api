import React from 'react';
import { connect } from 'react-redux';
import Button from '../Button/Button.component';

import { addProgramWorkout } from '../../redux/programWorkouts/programWorkouts.actions';
import { setAlert } from '../../redux/alerts/alerts.actions';

const WorkoutItem = ({
  workout,
  add,
  edit,
  del,
  programs: { currentProgram },
  workouts: { allWorkouts },
  addProgramWorkout,
  setAlert,
}) => {
  const { workout_id, workout_name } = workout;
  const { program_id, program_name } = currentProgram;

  const addAWorkout = () => {
    let workout_order = 0;
    if (allWorkouts) workout_order = allWorkouts.length;

    addProgramWorkout({ workout_id, program_id, workout_order, workout_name });
    setAlert('success', `Workout "${workout_name}" added to "${program_name}"`);
  };

  return (
    <li
      className='d-flex justify-content-between align-items-center w-100'
      style={{ borderBottom: '1px solid #dfdfdf' }}
    >
      <span>{workout_name}</span>
      <span className='d-flex'>
        {del ? <Button type='secondary' text='Delete' /> : null}
        {edit ? <Button type='secondary' text='Edit' className='ml-4' /> : null}
        {add ? <Button type='secondary' text='Add' className='ml-4' onClick={addAWorkout} /> : null}
      </span>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, { addProgramWorkout, setAlert })(WorkoutItem);
