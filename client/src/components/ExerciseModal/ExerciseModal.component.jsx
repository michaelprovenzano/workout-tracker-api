import React, { useState, useEffect } from 'react';

import Modal from '../Modal/Modal.component';
import InputText from '../InputText/InputText.component';
import InputCheckbox from '../InputCheckbox/InputCheckbox.component';
import Button from '../Button/Button.component';

const ExerciseModal = ({ exercise, buttonText, onSubmit, onClose, expanded }) => {
  let exercise_name = '',
    has_reps = false,
    has_weight = false,
    is_isometric = false;

  const [name, setName] = useState(exercise_name);
  const [hasReps, setHasReps] = useState(has_reps);
  const [hasWeight, setHasWeight] = useState(has_weight);
  const [isIsometric, setIsIsometric] = useState(is_isometric);

  useEffect(() => {
    if (exercise) {
      setName(exercise.exercise_name);
      setHasReps(exercise.has_reps);
      setHasWeight(exercise.has_weight);
      setIsIsometric(exercise.is_isometric);
    }
  }, [exercise, buttonText, onSubmit, onClose]);

  const clearForm = () => {
    setName('');
    setHasReps('');
    setHasWeight(false);
    setIsIsometric(false);
  };

  const closeModal = () => {
    onClose();
    clearForm();
  };

  const submitForm = e => {
    e.preventDefault();

    const newExercise = {
      exercise_name: name,
      has_reps: hasReps,
      has_weight: hasWeight,
      is_isometric: isIsometric,
    };
    if (exercise) newExercise.exercise_id = exercise.exercise_id;

    onSubmit(newExercise);
    clearForm();
  };

  return (
    <Modal expanded={expanded}>
      <div className='row mt-5'>
        <form
          className='mt-5 w-100'
          onSubmit={e => {
            submitForm(e);
          }}
        >
          <InputText
            type='text'
            label='Exercise Name'
            value={name}
            color='dark'
            className='mb-3'
            onChange={e => setName(e.target.value)}
          />
          <InputCheckbox
            label='Has Reps'
            id='has_reps'
            name='has_reps'
            checked={hasReps}
            onChange={() => setHasReps(!hasReps)}
          />
          <InputCheckbox
            label='Has Weights'
            id='has_weights'
            name='has_weights'
            checked={hasWeight}
            onChange={() => setHasWeight(!hasWeight)}
          />
          <InputCheckbox
            label='Is Isometric'
            id='is_isometric'
            name='is_isometric'
            checked={isIsometric}
            onChange={() => setIsIsometric(!isIsometric)}
          />
          <Button text={buttonText} type='primary' />
        </form>
      </div>
      <Button text='&times;' type='secondary' onClick={closeModal} className='modal-close' />
    </Modal>
  );
};
export default ExerciseModal;
