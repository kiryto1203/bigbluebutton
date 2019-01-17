import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';

export default function doActionTimer(credentials, action) {
    const REDIS_CONFIG = Meteor.settings.private.redis;
    const CHANNEL = REDIS_CONFIG.channels.myApps;

    const { meetingId, requesterUserId, requesterToken } = credentials;

    check(meetingId, String);
    check(requesterUserId, String);
    check(requesterToken, String);
    check(action, Object);

    action.createdAt = Date.now(); // server time

    let eventName = "doActionTimerPubMsg";
    return RedisPubSub.publishUserMessage(
        CHANNEL, eventName, meetingId, requesterUserId,
        { actionName: action.actionName, createdAt: action.createdAt,username: action.username },
    );
}
