import React from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../utils/apiCalls';
import './ForgotPasswordPage.styles.scss';

import { connect } from 'react-redux';
import { setAlert } from '../../redux/alerts/alerts.actions';

import InputText from '../../components/InputText/InputText.component';
import Button from '../../components/Button/Button.component';
import logo from '../../images/logo-signin.svg';

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super();

    this.state = {
      email: '',
      response: {
        status: null,
      },
    };
  }

  setField = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  forgotPassword = async e => {
    e.preventDefault();
    const { email } = this.state;
    const { setAlert } = this.props;

    const response = await api.post('forgot-password', { email });

    this.setState({ response });

    if (response.status === 'success') {
      setAlert('success', 'A link to reset your password has been sent to your email.');
    }

    if (response.status === 'fail') {
      setAlert('fail', response.data);
    }
  };

  render() {
    const { response } = this.state;
    if (response.status === 'success') return <Redirect to='/sign-in' />;

    return (
      <div className='signup-page offset-header'>
        <main className=''>
          <div className='row'>
            <div className='col-sm-6 offset-sm-3 col-lg-4 offset-lg-4 d-flex flex-column align-items-center'>
              <div className='logo d-flex justify-content-center flex-column'>
                <img src={logo} alt='logo' />
              </div>
              <p class='mb-5'>
                Enter your email below and a password reset link will be sent to your email.
              </p>
              <form className='w-100' onSubmit={this.forgotPassword}>
                <InputText
                  name='email'
                  type='text'
                  label='Email'
                  className='w-100'
                  onInput={e => this.setField(e, 'email')}
                />
                <Button text='Change Password' type='primary' className='w-100 sign-in' />
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default connect(null, { setAlert })(ForgotPasswordPage);
