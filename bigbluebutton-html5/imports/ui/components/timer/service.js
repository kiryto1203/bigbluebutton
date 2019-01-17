import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import Timers from '/imports/api/timer';
import mapUser from '/imports/ui/services/user/mapUser';
import { makeCall } from '/imports/ui/services/api';
import { SERVER_TIME_KEY } from '/imports/utils/sessionStorageKey';
import SessionStorage from '/imports/ui/services/storage/session';
import * as ACTION_TIMER from '/imports/utils/actionTimer';

const getCurrentUser = () => {
  const currentUserId = Auth.userID;
  const currentUser = Users.findOne({ userId: currentUserId });
  return (currentUser) ? mapUser(currentUser) : null;
};

const increaseTime = (minute, second) => {
  if (minute < 0 || second < 0) {
    throw Error("Minute or second in time can't be negative.");
  }
  if (second === 59) {
    minute++;
    second = 0;
  } else second++;
  return [minute, second];
};

const formatTimeInterval = time => (time.toString().length === 1 ? `0${time}` : time);

const doActionTimer = (action, userId, name) => {
  const timerPayload = {
    actionName: action,
    userId,
    username: name,
  };
  return makeCall('doActionTimer', timerPayload);
};

const getLastActionTimer = actionTimers =>
  (actionTimers.length < 1 ? {} : actionTimers[actionTimers.length - 1]);

const getActionTimer = () => Timers.find({
  meetingId: Auth.meetingID,
}, {
  sort: ['createdAt'],
}).fetch();

const getArrayRunTime = (actionTimers) => {
  if (!actionTimers || actionTimers.length < 1) return [0, 0];
  const runTimeBySecond = Math.ceil((countRunTime(actionTimers)) / 1000);
  return [parseInt(runTimeBySecond % 60), parseInt(runTimeBySecond / 60)];
};

const countRunTime = (actionTimers) => {
  if (actionTimers.length < 1) return 0;
  let timeSum = 0;
  for (let i = 0, length = actionTimers.length - 1; i < length; i++) {
    if (actionTimers[i].actionName === ACTION_TIMER.STOP) continue;
    let j = i + 1;
    let nextStop = actionTimers[j];
    while (nextStop.actionName === ACTION_TIMER.START) nextStop = actionTimers[j++];
    timeSum += actionTimers[i + 1].createdAt - actionTimers[i].createdAt;
  }
  const lastActionTimer = getLastActionTimer(actionTimers);
  timeSum += lastActionTimer.actionName !== ACTION_TIMER.STOP
    ? SessionStorage.getItem(SERVER_TIME_KEY) - lastActionTimer.createdAt
    : 0;
  return timeSum;
};


export default {
  getCurrentUser,
  increaseTime,
  formatTimeInterval,
  doActionTimer,
  getActionTimer,
  getLastActionTimer,
  getArrayRunTime,
};
