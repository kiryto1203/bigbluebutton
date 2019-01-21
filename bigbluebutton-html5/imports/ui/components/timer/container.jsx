import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Timer from './component';
import Service from './service';

const propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  increaseTime: PropTypes.func.isRequired,
  formatTimeInterval: PropTypes.func.isRequired,
  doActionTimer: PropTypes.func.isRequired,
  getActionTimer: PropTypes.func.isRequired,
  getLastActionTimer: PropTypes.func.isRequired,
  getArrayRunTime: PropTypes.func.isRequired,
};

const TimerContainer = props => <Timer {...props} />;

TimerContainer.propTypes = propTypes;

export default withTracker(() => {
  const actionTimers = Service.getActionTimer();
  return {
    currentUser: Service.getCurrentUser(),
    getLastActionTimer: Service.getLastActionTimer,
    increaseTime: Service.increaseTime,
    formatTimeInterval: Service.formatTimeInterval,
    doActionTimer: Service.doActionTimer,
    getArrayRunTime: Service.getArrayRunTime,
    getActionTimer: Service.getActionTimer,
  };
})(TimerContainer);
