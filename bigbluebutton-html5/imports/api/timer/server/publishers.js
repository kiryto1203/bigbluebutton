import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Timers from '/imports/api/timer';
import Logger from '/imports/startup/server/logger';
import mapToAcl from '/imports/startup/mapToAcl';

function timers(credentials) {
    const { meetingId, requesterUserId, requesterToken } = credentials;

    check(meetingId, String);
    check(requesterUserId, String);
    check(requesterToken, String);

    Logger.info(`Publishing Timers for ${meetingId} ${requesterUserId} ${requesterToken}`);

    return Timers.find({ meetingId });
}

function publish(...args) {
    const boundTimers = timers.bind(this);
    return mapToAcl('subscriptions.timers', boundTimers)(args);
}

Meteor.publish('timers', publish);
