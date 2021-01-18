import React from 'react';
import { connect } from 'react-redux';

import Button from '../Button/Button.component';
import ExerciseModal from '../ExerciseModal/ExerciseModal.component';

import { addWorkoutExercise } from '../../redux/workoutExercises/workoutExercises.actions';
import { setAlert } from '../../redux/alerts/alerts.actions';

const AdminExerciseItem = ({
  exercise,
  add,
  edit,
  del,
  programWorkouts: { currentProgramWorkout },
  workoutExercises: { currentWorkoutExercises },
  addWorkoutExercise,
  setAlert,
}) => {
  const { exercise_id, exercise_name } = exercise;
  const { workout_id, workout_name } = currentProgramWorkout;

  const addExercise = () => {
    let exercise_order = 0;
    if (currentWorkoutExercises) exercise_order = currentWorkoutExercises.length;

    addWorkoutExercise({ exercise_id, workout_id, exercise_order, exercise_name });
    setAlert('success', `Exercise "${exercise_name}" added to "${workout_name}"`);
  };

  return (
    <li
      className='d-flex justify-content-between align-items-center w-100'
      style={{ borderBottom: '1px solid #dfdfdf' }}
    >
      <span>{exercise_name}</span>
      <span className='d-flex'>
        {del ? <Button type='secondary' text='Delete' /> : null}
        {edit ? (
          <Button type='secondary' text='Edit' className='ml-4' onClick={() => edit(exercise)} />
        ) : null}
        {add ? <Button type='secondary' text='Add' className='ml-4' onClick={addExercise} /> : null}
      </span>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, { addWorkoutExercise, setAlert })(AdminExerciseItem);
