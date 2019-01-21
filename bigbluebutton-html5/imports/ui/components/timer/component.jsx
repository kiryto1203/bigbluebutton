import React, { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { withRouter } from 'react-router';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import PropTypes from 'prop-types';
import { styles } from './styles';
import Button from '../button/component';
import Clock from './clock/component';
import { Meteor } from 'meteor/meteor';
import ACTION_TIMER from '/imports/utils/actionTimer';

const propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  increaseTime: PropTypes.func.isRequired,
  formatTimeInterval: PropTypes.func.isRequired,
  doActionTimer: PropTypes.func.isRequired,
  getActionTimer: PropTypes.func.isRequired,
  getLastActionTimer: PropTypes.func.isRequired,
  getArrayRunTime: PropTypes.func.isRequired,
};

const intlMessages = defineMessages({
  startLabel: {
    id: 'app.timer.startButton',
    description: 'Start Class',
  },
  stopLabel: {
    id: 'app.timer.stopButton',
    description: 'Stop Class',
  },
});

class Timer extends Component {
  constructor(props) {
    super(props);
    this.actionTimers = this.props.getActionTimer();
    const lastActionTimer = this.props.getLastActionTimer(this.actionTimers);
    const arrayRunTime = this.props.getArrayRunTime(this.actionTimers);
    this.state = {
      btnLabel: lastActionTimer && lastActionTimer.actionName === ACTION_TIMER.START ? intlMessages.stopLabel : intlMessages.startLabel,
      second: arrayRunTime[0],
      minute: arrayRunTime[1],
    };
    this.handleClickButton = this.handleClickButton.bind(this);
    this.setTimeInterval = this.setTimeInterval.bind(this);

    this.timeInterval = lastActionTimer && lastActionTimer.actionName === ACTION_TIMER.START ? this.setTimeInterval() : {};
  }

  handleClickButton() {
    const { currentUser, doActionTimer } = this.props;
    if (this.state.btnLabel === intlMessages.startLabel) {
      doActionTimer(ACTION_TIMER.START, currentUser.userId, currentUser.name);
      this.setState({ btnLabel: intlMessages.stopLabel });
      // this.timeInterval = this.setTimeInterval();
    } else {
      doActionTimer(ACTION_TIMER.STOP, currentUser.userId, currentUser.name);
      this.setState({ btnLabel: intlMessages.startLabel });
      // this.removeTimeInterval();
    }
  }

  setTimeInterval() {
    return Meteor.setInterval(() => {
      const times = this.props.increaseTime(this.state.minute, this.state.second);
      this.setState({
        minute: times[0],
        second: times[1],
      });
    }, 1000);
  }

  removeTimeInterval() {
    Meteor.clearInterval(this.timeInterval);
  }

  shouldComponentUpdate() {
    const actionTimers = this.props.getActionTimer();
    if (actionTimers.length < 1) return true;
    const nextLastActionTimer = this.props.getLastActionTimer(actionTimers);
    console.log(this.actionTimers);
    console.log(actionTimers);
    if (this.actionTimers.length !== actionTimers.length) {
      if (nextLastActionTimer.actionName === ACTION_TIMER.START) {
        this.timeInterval = this.setTimeInterval();
        this.actionTimers = actionTimers;
      } else this.removeTimeInterval();
    } else {
      if (nextLastActionTimer.actionName === ACTION_TIMER.START) return true;
      this.removeTimeInterval();
    }
    return true;
  }

  render() {
    const {
      intl,
      formatTimeInterval,
      currentUser,
    } = this.props;
    const blockClassName = `${styles.block} ${currentUser.isModerator ? styles.blockModerator : styles.blockViewer}`;
    return (
      <div className={blockClassName}>
        <Clock formatTimeInterval={formatTimeInterval} second={this.state.second} minute={this.state.minute} />
        { currentUser.isModerator ? <Button
          data-test="modalBaseCloseButton"
          className={styles.startBtn}
          label={intl.formatMessage(this.state.btnLabel)}
          size="md"
          onClick={this.handleClickButton}
        /> : '' }
      </div>
    );
  }
}

Timer.propTypes = propTypes;

export default withRouter(injectWbResizeEvent(injectIntl(Timer)));
