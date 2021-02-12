import React from 'react';
import './ProgressBar.styles.scss';

class ProgressBar extends React.Component {
  render() {
    const { progress, progressSecondary, classes } = this.props;

    return (
      <div className={`progress-bar ${classes}`}>
        {progressSecondary && (
          <div
            className='progress progress-secondary'
            style={{ width: `${progressSecondary}%` }}
          ></div>
        )}
        <div className='progress progress-primary' style={{ width: `${progress}%` }}></div>
      </div>
    );
  }
}

export default ProgressBar;
