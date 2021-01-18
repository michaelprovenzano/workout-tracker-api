import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AddExercisePage.styles.scss';

import { connect } from 'react-redux';
import {
  addExercise,
  updateExercise,
  fetchAllExercises,
} from '../../../redux/exercises/exercises.actions';
import { fetchAllWorkouts, setCurrentWorkout } from '../../../redux/workouts/workouts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import InputText from '../../../components/InputText/InputText.component';
import Button from '../../../components/Button/Button.component';
import AdminExerciseItem from '../../../components/AdminExerciseItem/AdminExerciseItem.component';
import ExerciseModal from '../../../components/ExerciseModal/ExerciseModal.component';
import LoaderSpinner from 'react-loader-spinner';

const AddExercisePage = ({
  workouts: { allWorkouts, currentWorkout },
  exercises: { allExercises },
  addExercise,
  updateExercise,
  setCurrentWorkout,
  fetchAllExercises,
  match,
}) => {
  const { workoutId } = match.params;
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);

  useEffect(() => {
    if (!allWorkouts) {
      fetchAllWorkouts();
    } else {
      let thisWorkout = allWorkouts.find(workout => workout.workout_id === parseInt(workoutId));
      setCurrentWorkout(thisWorkout);
    }

    fetchAllExercises();
    // eslint-disable-next-line
  }, [allWorkouts]);

  if (!currentWorkout || !allExercises)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  const createExercise = async exercise => {
    addExercise(exercise);
    setSearch('');
    setModal(false);
  };

  const updateThisExercise = async exercise => {
    updateExercise(exercise);
    setActiveExercise(null);
    setModal(false);
  };

  const editExercise = exercise => {
    setModal(true);
    setModalEdit(true);
    setActiveExercise(exercise);
  };

  const filterExercises = e => {
    setSearch(e.target.value);
  };

  return (
    <div className='edit-program-page offset-header'>
      <Header text={`Add an exercise to ${currentWorkout.workout_name}`} history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            <Button
              text={`Create New Exercise`}
              type='primary'
              className='w-100 mt-4'
              onClick={e => {
                setModal(true);
              }}
            />
            <InputText
              type='text'
              value={search}
              color='dark'
              label='Search'
              className='mt-5 mb-5'
              onInput={e => filterExercises(e)}
            />
            <ExerciseModal
              buttonText={modalEdit ? 'Update Exercise' : 'Create Exercise'}
              exercise={activeExercise}
              expanded={modal}
              onClose={() => {
                setModal(false);
                setModalEdit(false);
              }}
              onSubmit={modalEdit ? updateThisExercise : createExercise}
            />

            <div className='row'>
              <ul className='w-100'>
                {allExercises
                  .filter(exercise =>
                    exercise.exercise_name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((exercise, i) => {
                    return <AdminExerciseItem exercise={exercise} add edit={editExercise} />;
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
  addExercise,
  updateExercise,
  setCurrentWorkout,
  fetchAllExercises,
})(AddExercisePage);
