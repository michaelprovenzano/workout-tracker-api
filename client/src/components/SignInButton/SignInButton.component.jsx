import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setCurrentUser, removeCurrentUser } from '../../redux/user/user.actions';
import { setAlert } from '../../redux/alerts/alerts.actions';
import './SignInButton.styles.scss';

const SignInButton = ({
  text,
  position,
  type,
  email,
  password,
  className,
  user,
  setAlert,
  setCurrentUser,
  removeCurrentUser,
}) => {
  const signIn = (e, email, password) => {
    e.preventDefault();
    setCurrentUser(email, password);
  };

  if (user.token) return <Redirect to={'/dashboard'} />;
  if (user.status === 'fail') {
    setAlert('fail', user.message);
    removeCurrentUser();
  }

  return (
    <button
      className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
      onClick={e => {
        signIn(e, email, password);
      }}
    >
      {text}
    </button>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, { setCurrentUser, removeCurrentUser, setAlert })(
  SignInButton
);
