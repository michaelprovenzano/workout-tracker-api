import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditWorkoutPage.styles.scss';

import { connect } from 'react-redux';
import { setAlert } from '../../../redux/alerts/alerts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import InputText from '../../../components/InputText/InputText.component';
import Button from '../../../components/Button/Button.component';
import ExerciseList from '../../../components/ExerciseList/ExerciseList.component';
import LoaderSpinner from 'react-loader-spinner';
import {
  fetchProgramWorkouts,
  updateProgramWorkout,
} from '../../../redux/programWorkouts/programWorkouts.actions';
import { fetchWorkoutExercises } from '../../../redux/workoutExercises/workoutExercises.actions';

const EditWorkoutPage = ({
  programs: { currentProgram, allPrograms },
  programWorkouts: { currentProgramWorkouts, currentProgramWorkout },
  workoutExercises: { currentWorkoutExercises },
  updateProgramWorkout,
  fetchProgramWorkouts,
  fetchWorkoutExercises,
  setAlert,
  match,
}) => {
  const { workoutId } = match.params;
  const history = useHistory();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!currentProgramWorkouts) {
      fetchProgramWorkouts();
    } else {
      setName(currentProgramWorkout.workout_name);
      fetchWorkoutExercises(currentProgramWorkout.workout_id);
    }

    // eslint-disable-next-line
  }, [allPrograms, currentProgramWorkout]);

  const saveWorkout = async () => {
    updateProgramWorkout({
      ...currentProgramWorkout,
      workout_name: name,
    });

    setAlert('success', 'Saved successfully');
    history.push(`/admin/edit-programs/${currentProgram.program_id}`);
  };

  if (!currentProgram || !currentProgramWorkouts)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  return (
    <div className='edit-workout-page offset-header'>
      <Header text={name} history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            <Button
              text='Save Workout'
              type='primary'
              className='w-100 mt-4'
              onClick={saveWorkout}
            />
            <form className='mt-5'>
              <InputText
                type='text'
                label='Name'
                value={name}
                color='dark'
                onInput={e => setName(e.target.value)}
                className='mb-5'
              />
            </form>
            <div className='d-flex justify-content-between align-items-center w-100'>
              <h3>Exercises</h3>
              <Button
                text='Add Exercise'
                type='secondary'
                onClick={e => history.push(`${currentProgramWorkout.workout_id}/add-exercise`)}
              />
            </div>
            <ExerciseList />
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, {
  updateProgramWorkout,
  fetchProgramWorkouts,
  fetchWorkoutExercises,
  setAlert,
})(EditWorkoutPage);
