import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditProgramsPage.styles.scss';

import { connect } from 'react-redux';
import {
  setCurrentPrograms,
  addCurrentProgram,
} from '../../../redux/currentPrograms/currentPrograms.actions';
import {
  setCurrentProgram,
  clearCurrentProgram,
} from '../../../redux/currentProgram/currentProgram.actions';
import {
  setCurrentWorkouts,
  clearCurrentWorkouts,
} from '../../../redux/currentWorkouts/currentWorkouts.actions';

// Components
import Header from '../../../components/Header/Header.component';
import ProgramItem from '../../../components/ProgramItem/ProgramItem.component';
import Button from '../../../components/Button/Button.component';
import LoaderSpinner from 'react-loader-spinner';

const EditProgramsPage = ({
  currentPrograms,
  setCurrentPrograms,
  setCurrentProgram,
  addCurrentProgram,
  setCurrentWorkouts,
  clearCurrentWorkouts,
}) => {
  const history = useHistory();

  useEffect(() => {
    clearCurrentProgram();
    clearCurrentWorkouts();
    setCurrentPrograms();
    // eslint-disable-next-line
  }, []);

  const goToProgram = async (e, program_id) => {
    setCurrentProgram(program_id);
    setCurrentWorkouts(program_id);
    history.push(`/admin/edit-programs/${program_id}`);
  };

  const addProgram = e => {
    // Add a new program
    addCurrentProgram({
      name: 'New Program',
      mode: 'Classic',
      company: 'Company',
    });
  };

  if (!currentPrograms)
    return (
      <div
        className='w-100 d-flex justify-content-center align-items-center'
        style={{ height: '100vh' }}
      >
        <LoaderSpinner type='Grid' color='#196cff' height={40} width={80} />
      </div>
    );

  return (
    <div className='my-programs-page offset-header'>
      <Header text='Edit Programs' history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            <Button
              type='primary'
              text='Add Program'
              className='w-100 mt-5 mb-5'
              onClick={addProgram}
            />
            {currentPrograms
              ? currentPrograms.map((program, i) => {
                  let { program_id, program_name } = program;
                  return (
                    <div className='w-100 d-flex flex-column align-items-center' key={i}>
                      <ProgramItem
                        key={i}
                        id={i}
                        name={program_name}
                        history={history}
                        onClick={e => goToProgram(e, program_id)}
                        program
                      />
                    </div>
                  );
                })
              : null}
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
  clearCurrentProgram,
  addCurrentProgram,
  setCurrentWorkouts,
  clearCurrentWorkouts,
})(EditProgramsPage);
