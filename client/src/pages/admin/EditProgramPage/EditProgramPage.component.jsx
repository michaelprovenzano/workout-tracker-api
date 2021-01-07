import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditProgramPage.styles.scss';

import { connect } from 'react-redux';
import {
  fetchPrograms,
  setCurrentProgram,
  updateCurrentProgram,
  clearCurrentProgram,
} from '../../../redux/programs/programs.actions';
import { setAlert } from '../../../redux/alerts/alerts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import InputText from '../../../components/InputText/InputText.component';
import Button from '../../../components/Button/Button.component';
import WorkoutList from '../../../components/WorkoutList/WorkoutList.component';
import LoaderSpinner from 'react-loader-spinner';

const EditProgramsPage = ({
  programs: { allPrograms, currentProgram },
  currentWorkouts,
  fetchPrograms,
  setCurrentProgram,
  updateCurrentProgram,
  setAlert,
  match,
}) => {
  const { programId } = match.params;
  const history = useHistory();
  const [name, setName] = useState('');
  const [mode, setMode] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    if (!allPrograms) {
      fetchPrograms();
    } else {
      let thisProgram = allPrograms.find(program => program.program_id === parseInt(programId));
      setCurrentProgram(thisProgram);
      setName(thisProgram.program_name);
      setMode(thisProgram.mode);
      setCompany(thisProgram.company);
    }

    // eslint-disable-next-line
  }, [allPrograms, currentWorkouts]);

  const saveProgram = async () => {
    updateCurrentProgram({
      program_id: currentProgram.program_id,
      program_name: name,
      mode: mode,
      company: company,
    });

    setAlert('success', 'Saved successfully');
    history.push(`/admin/edit-programs`);
  };

  if (!currentProgram || !currentWorkouts)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  return (
    <div className='edit-program-page offset-header'>
      <Header text={name} history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            <Button
              text='Save Program'
              type='primary'
              className='w-100 mt-4'
              onClick={saveProgram}
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
              <Button
                text='Add Workout'
                type='secondary'
                onClick={e => history.push(`${currentProgram.program_id}/add-workout`)}
              />
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
  fetchPrograms,
  setCurrentProgram,
  updateCurrentProgram,
  clearCurrentProgram,
  setAlert,
})(EditProgramsPage);
