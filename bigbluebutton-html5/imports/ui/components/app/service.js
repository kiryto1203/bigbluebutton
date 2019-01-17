import Breakouts from '/imports/api/breakouts';
import Settings from '/imports/ui/services/settings';
import Auth from '/imports/ui/services/auth/index';
import { makeCall } from '/imports/ui/services/api';
import SessionStorage from '/imports/ui/services/storage/session';
import { SERVER_TIME_KEY } from '../../../utils/sessionStorageKey';

if (Meteor.isClient) {
  Meteor.startup(() => {
    setInterval(() => {
      makeCall('getServerTime').then((result) => {
        SessionStorage.setItem(SERVER_TIME_KEY, result);
      });
    }, 100);
  });
}

const getCaptionsStatus = () => {
  const ccSettings = Settings.cc;
  return ccSettings ? ccSettings.enabled : false;
};

const getFontSize = () => {
  const applicationSettings = Settings.application;
  return applicationSettings ? applicationSettings.fontSize : '16px';
};

function meetingIsBreakout() {
  const breakouts = Breakouts.find().fetch();
  return (breakouts && breakouts.some(b => b.breakoutId === Auth.meetingID));
}

export {
  getCaptionsStatus,
  getFontSize,
  meetingIsBreakout,
};
