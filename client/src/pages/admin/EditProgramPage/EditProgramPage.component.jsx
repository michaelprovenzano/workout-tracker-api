import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditProgramPage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentPrograms } from '../../../redux/currentPrograms/currentPrograms.actions';
import {
  setCurrentProgram,
  clearCurrentProgram,
} from '../../../redux/currentProgram/currentProgram.actions';
import { setCurrentWorkouts } from '../../../redux/currentWorkouts/currentWorkouts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import InputText from '../../../components/InputText/InputText.component';
import Button from '../../../components/Button/Button.component';
import WorkoutList from '../../../components/WorkoutList/WorkoutList.component';
import LoaderSpinner from 'react-loader-spinner';

const EditProgramsPage = ({
  currentPrograms,
  currentProgram,
  currentWorkouts,
  setCurrentPrograms,
  setCurrentProgram,
  setCurrentWorkouts,
  match,
}) => {
  const { programId } = match.params;
  const history = useHistory();
  const [name, setName] = useState('');
  const [mode, setMode] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    setCurrentPrograms();
    if (!currentProgram) setCurrentProgram(programId);
    setCurrentWorkouts(programId);
    if (currentProgram) {
      setName(currentProgram.name);
      setMode(currentProgram.mode);
      setCompany(currentProgram.company);
    }
    // eslint-disable-next-line
  }, [currentProgram]);

  const goToProgram = async (e, program_id) => {
    setCurrentProgram(program_id);
    history.push(`/admin/edit-programs/${program_id}`);
  };

  if (!currentProgram)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  // TODO: Create or modify workouts endpoint to update multiple workouts with one call
  // TODO: Update workouts via API
  return (
    <div className='edit-program-page offset-header'>
      <Header text={name} history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            <Button text='Save Program' type='primary' className='w-100 mt-4' />
            <form className='mt-5'>
              <InputText
                type='text'
                label='Name'
                value={name}
                color='dark'
                onInput={e => setName(e.target.value)}
                className='mb-5'
              />
              <InputText
                type='text'
                label='Mode'
                value={mode}
                color='dark'
                onInput={e => setMode(e.target.value)}
                className='mb-5'
              />
              <InputText
                type='text'
                label='Company'
                value={company}
                color='dark'
                onInput={e => setCompany(e.target.value)}
                className='mb-5'
              />
            </form>
            <div className='d-flex justify-content-between align-items-center w-100'>
              <h3>Workouts</h3>
              <Button text='Add Workout' type='secondary' />
            </div>
            <WorkoutList />
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
  setCurrentPrograms,
  setCurrentProgram,
  setCurrentWorkouts,
  clearCurrentProgram,
})(EditProgramsPage);
