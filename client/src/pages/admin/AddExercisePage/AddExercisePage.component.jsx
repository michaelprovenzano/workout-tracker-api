import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AddExercisePage.styles.scss';
import api from '../../../utils/apiCalls';

import { connect } from 'react-redux';
import { setCurrentWorkouts } from '../../../redux/currentWorkouts/currentWorkouts.actions';
import {
  setCurrentProgram,
  clearCurrentProgram,
} from '../../../redux/currentProgram/currentProgram.actions';
import { fetchAllWorkouts, addWorkout } from '../../../redux/workouts/workouts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import InputText from '../../../components/InputText/InputText.component';
import Button from '../../../components/Button/Button.component';
import WorkoutItem from '../../../components/WorkoutItem/WorkoutItem.component';
import Modal from '../../../components/Modal/Modal.component';
import LoaderSpinner from 'react-loader-spinner';

const AddExercisePage = ({
  allWorkouts,
  addWorkout,
  currentPrograms,
  currentWorkout,
  setCurrentWorkouts,
  setCurrentProgram,
  fetchAllWorkouts,
  match,
}) => {
  const { workoutId } = match.params;
  const history = useHistory();
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (!currentPrograms) {
      setCurrentWorkouts();
    } else {
      let thisProgram = currentPrograms.find(program => program.program_id === parseInt(workoutId));
      setCurrentProgram(thisProgram);
    }

    fetchAllWorkouts();
    // eslint-disable-next-line
  }, [currentPrograms]);

  if (!currentWorkout || !allWorkouts)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  const createWorkout = async () => {
    addWorkout({
      workout_name: name,
    });

    setName('');
    setSearch('');
    setModal(false);
  };

  const filterWorkouts = e => {
    setSearch(e.target.value);
  };

  return (
    <div className='edit-program-page offset-header'>
      <Header text={`Add a workout to ${currentWorkout.workout_name}`} history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            <Button
              text={`Create New Workout`}
              type='primary'
              className='w-100 mt-4'
              onClick={e => setModal(!modal)}
            />
            <InputText
              type='text'
              value={search}
              color='dark'
              label='Search'
              className='mt-5 mb-5'
              onInput={e => filterWorkouts(e)}
            />
            <Modal expanded={modal}>
              <div className='row mt-5'>
                <form className='mt-5 w-100'>
                  <InputText
                    type='text'
                    label='Workout Name'
                    value={name}
                    color='dark'
                    onInput={e => setName(e.target.value)}
                    className='mb-5'
                  />
                </form>
              </div>
              <Button
                text='&times;'
                type='secondary'
                onClick={e => setModal(false)}
                className='modal-close'
              />
              <Button text='Create Workout' type='primary' onClick={createWorkout} />
            </Modal>

            <div className='row'>
              <ul className='w-100'>
                {allWorkouts
                  .filter(workout => workout.workout_name.includes(search))
                  .map((workout, i) => {
                    return <WorkoutItem workout={workout} add edit />;
                  })}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  allWorkouts: state.workouts.allWorkouts,
});

const getUniqueWorkouts = workouts => {
  const uniqueWorkoutsMap = {};
  const uniqueWorkouts = [];
  workouts.forEach(workout => {
    if (!uniqueWorkoutsMap[workout.workout_id]) {
      uniqueWorkoutsMap[workout.workout_id] = true;
      uniqueWorkouts.push(workout);
    }
  });

  return uniqueWorkouts;
};

export default connect(mapStateToProps, {
  addWorkout,
  setCurrentWorkouts,
  setCurrentProgram,
  clearCurrentProgram,
  fetchAllWorkouts,
})(AddExercisePage);
