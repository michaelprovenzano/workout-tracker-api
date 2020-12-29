import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './EditProgramsPage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentPrograms } from '../../../redux/currentPrograms/currentPrograms.actions';
import {
  setCurrentProgram,
  clearCurrentProgram,
} from '../../../redux/currentProgram/currentProgram.actions';

// Components
import Header from '../../../components/Header/Header.component';
import ProgramItem from '../../../components/ProgramItem/ProgramItem.component';
import LoaderSpinner from 'react-loader-spinner';

const EditProgramsPage = ({ currentPrograms, setCurrentPrograms, setCurrentProgram }) => {
  const history = useHistory();

  useEffect(() => {
    clearCurrentProgram();
    setCurrentPrograms();
    // eslint-disable-next-line
  }, []);

  const goToProgram = async (e, program_id) => {
    setCurrentProgram(program_id);
    history.push(`/admin/edit-programs/${program_id}`);
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
      <Header text='My Schedule' history={history} />
      <main className=''>
        <div className='row'>
          <div className='col-lg-8 offset-lg-2'>
            {currentPrograms
              ? currentPrograms.map((program, i) => {
                  let { program_id } = program;
                  return (
                    <div className='w-100 d-flex flex-column align-items-center' key={i}>
                      <ProgramItem
                        key={i}
                        id={i}
                        name={program.name}
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
})(EditProgramsPage);
