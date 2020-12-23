import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Components
import Alert from '../Alert/Alert.component';

import './Alerts.styles.scss';

const Alerts = ({ alerts }) => {
  return (
    <div className='alerts'>
      <TransitionGroup>
        {alerts.map((alert, i) => (
          <CSSTransition key={`alert-${i}`} timeout={300} classNames='alert'>
            <Alert message={alert.message} type={alert.type} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

const mapStateToProps = state => ({
  alerts: state.alerts,
});

export default connect(mapStateToProps, null)(Alerts);
