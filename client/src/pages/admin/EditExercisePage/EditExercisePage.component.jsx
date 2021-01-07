import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditExercisePage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentExercise } from '../../../redux/currentExercise/currentExercise.actions';
import { updateOneCurrentExercises } from '../../../redux/currentExercises/currentExercises.actions';
import { setAlert } from '../../../redux/alerts/alerts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import InputText from '../../../components/InputText/InputText.component';
import InputCheckbox from '../../../components/InputCheckbox/InputCheckbox.component';
import Button from '../../../components/Button/Button.component';
import LoaderSpinner from 'react-loader-spinner';

const EditExercisePage = ({
  currentExercise,
  updateOneCurrentExercises,
  setCurrentExercise,
  setAlert,
  match,
}) => {
  const { exerciseId } = match.params;
  const history = useHistory();
  const [name, setName] = useState('');
  const [hasWeight, setHasWeight] = useState(false);
  const [isIsometric, setIsIsometric] = useState(false);
  const [hasReps, setHasReps] = useState(false);

  useEffect(() => {
    if (currentExercise) {
      const { exercise_name, exercise_id, has_weight, is_isometric, has_reps } = currentExercise;
      //    Set current exercise
      // if (exercise_id !== parseInt(exerciseId))
      setName(exercise_name);
      setHasReps(has_reps);
      setHasWeight(has_weight);
      setIsIsometric(is_isometric);
    }

    // eslint-disable-next-line
  }, [currentExercise]);

  const saveExercise = async () => {
    const newExercise = {
      exercise_id: currentExercise.exercise_id,
      exercise_name: name,
      has_reps: hasReps,
      has_weight: hasWeight,
      is_isometric: isIsometric,
    };

    updateOneCurrentExercises(newExercise);
    setCurrentExercise(newExercise);

    setAlert('success', 'Saved successfully');
  };

  if (!currentExercise)
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
              onClick={saveExercise}
            />
            <form className='mt-5'>
              <InputText
                type='text'
                label='Name'
                value={name}
                color='dark'
                onChange={e => setName(e.target.value)}
                className='mb-5'
              />
              <div className='d-flex flex-wrap justify-content-around'>
                <InputCheckbox
                  label='Has Reps'
                  id='has-reps'
                  name='has_reps'
                  checked={hasReps}
                  onChange={() => setHasReps(!hasReps)}
                />
                <InputCheckbox
                  label='Is Isometric'
                  id='is-isometric'
                  name='is_isometric'
                  checked={isIsometric}
                  onChange={() => setIsIsometric(!isIsometric)}
                />
                <InputCheckbox
                  label='Has Weight'
                  id='has-weight'
                  name='has_weight'
                  checked={hasWeight}
                  onChange={() => setHasWeight(!hasWeight)}
                />
              </div>
            </form>
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
  setAlert,
  setCurrentExercise,
  updateOneCurrentExercises,
})(EditExercisePage);
