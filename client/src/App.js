import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import './styles/bootstrap/bootstrap-grid.css';
import './App.scss';

import Navigation from './components/Navigation/Navigation.component';
import Alerts from './components/Alerts/Alerts.component';

// Pages
import Dashboard from './pages/Dashboard/Dashboard.component';
import WorkoutPage from './pages/WorkoutPage/WorkoutPage.component';
import ExercisePage from './pages/ExercisePage/ExercisePage.component';
import SignupPage from './pages/SignupPage/SignupPage.component';
import SigninPage from './pages/SigninPage/SigninPage.component';
import MyProgramsPage from './pages/MyProgramsPage/MyProgramsPage.component';
import ProgramsPage from './pages/ProgramsPage/ProgramsPage.component';
import MySchedulePage from './pages/MySchedulePage/MySchedulePage.component';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage.component';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage.component';
import EditProgramsPage from './pages/admin/EditProgramsPage/EditProgramsPage.component';
import EditProgramPage from './pages/admin/EditProgramPage/EditProgramPage.component';
import EditWorkoutPage from './pages/admin/EditWorkoutPage/EditWorkoutPage.component';
import EditExercisePage from './pages/admin/EditExercisePage/EditExercisePage.component';
import AddWorkoutPage from './pages/admin/AddWorkoutPage/AddWorkoutPage.component';
import AddExercisePage from './pages/admin/AddExercisePage/AddExercisePage.component';

function App({ user }) {
  return (
    <div className='App'>
      <Navigation />
      <Alerts />
      <Route exact path='/sign-up' component={SignupPage} />
      <Route exact path='/sign-in' component={SigninPage} />
      <Route exact path='/forgot-password' component={ForgotPasswordPage} />
      <Route exact path='/reset-password/:token' component={ResetPasswordPage} />
      {!user.token ? (
        <Route exact path='/'>
          <Redirect to='/sign-in' />
        </Route>
      ) : (
        <Fragment>
          <Route exact path='/'>
            <Redirect to='/dashboard' />
          </Route>
          <Route exact path='/my-programs' component={MyProgramsPage} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/programs' component={ProgramsPage} />
          <Route exact path='/program-logs/:programLogId' component={MySchedulePage} />
          <Route exact path='/workout-logs/:workoutLogId' component={WorkoutPage} />
          <Route exact path='/workout-logs/:workoutLogId/:exerciseLogId' component={ExercisePage} />
          <Route exact path='/admin/edit-programs' component={EditProgramsPage} />
          <Route exact path='/admin/edit-programs/:programId' component={EditProgramPage} />
          <Route exact path='/admin/edit-workouts/:workoutId' component={EditWorkoutPage} />
          <Route exact path='/admin/edit-exercises/:exerciseId' component={EditExercisePage} />
          <Route
            exact
            path='/admin/edit-workouts/:workoutId/add-exercise'
            component={AddExercisePage}
          />
          <Route
            exact
            path='/admin/edit-programs/:programId/add-workout'
            component={AddWorkoutPage}
          />
        </Fragment>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, null)(App);
