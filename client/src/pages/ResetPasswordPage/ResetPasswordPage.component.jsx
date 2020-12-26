import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './ResetPasswordPage.styles.scss';
import api from '../../utils/apiCalls';
import { connect } from 'react-redux';
import { setAlert } from '../../redux/alerts/alerts.actions';

import InputText from '../../components/InputText/InputText.component';
import Button from '../../components/Button/Button.component';
import logo from '../../images/logo-signin.svg';

class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordConfirm: '',
      response: {
        status: null,
      },
    };
  }

  setField = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  resetPassword = async e => {
    e.preventDefault();
    const { setAlert } = this.props;
    const { token } = this.props.match.params;
    let { password, passwordConfirm } = this.state;

    let response = await api.post(`/reset-password/${token}`, {
      password,
      passwordConfirm,
    });

    if (response.status === 'success') {
      setAlert('success', 'Password changed successfully');
    }
    if (response.status === 'fail') {
      setAlert(
        'fail',
        'Password change unsuccessful. Verify passwords match or request a new password change email.'
      );
    }

    this.setState({ response });
  };

  render() {
    const { response } = this.state;
    if (response.status === 'success') return <Redirect to='/sign-in' />;

    return (
      <div className='reset-password-page offset-header'>
        <main className=''>
          <div className='row'>
            <div className='col-sm-6 offset-sm-3 col-lg-4 offset-lg-4 d-flex flex-column align-items-center'>
              <div className='logo d-flex justify-content-center flex-column'>
                <img src={logo} alt='logo' />
              </div>
              <form className='w-100' onSubmit={this.resetPassword}>
                <InputText
                  name='password'
                  type='password'
                  label='New Password'
                  className='w-100'
                  onInput={e => this.setField(e, 'password')}
                />
                <InputText
                  name='password-confirm'
                  type='password'
                  label='Confirm New Password'
                  className='w-100'
                  onInput={e => this.setField(e, 'passwordConfirm')}
                />
                <Button text='Update Password' type='primary' className='w-100 sign-in' />
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default connect(null, { setAlert })(ResetPasswordPage);
