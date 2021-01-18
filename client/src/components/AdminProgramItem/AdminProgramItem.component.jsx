import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import './AdminProgramItem.styles.scss';

import Arrow from '../Arrow/Arrow.component';

const AdminProgramItem = ({ name, mode, company, classes, onClick, id, url }) => {
  const history = useHistory();

  const goToUrl = e => {
    if (url) history.push(url);
  };

  return (
    <button
      id={id}
      className={`admin-program-item outline-none ${classes ? classes : ''}`}
      onClick={onClick ? onClick : goToUrl}
    >
      <div className='d-flex justify-content-between'>
        <div className='d-flex flex-column justify-content-center align-items-start'>
          <div className='name mb-2'>{name}</div>
          <div className='d-flex align-items-center'>{mode}</div>
          <div className='d-flex align-items-center'>{company}</div>
        </div>
        <div className='d-flex justify-content-end align-items-center'>
          <Arrow direction='right' />
        </div>
      </div>
    </button>
  );
};

export default AdminProgramItem;
