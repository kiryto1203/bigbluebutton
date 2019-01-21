import { Meteor } from 'meteor/meteor';

const Timers = new Mongo.Collection('timers');

if (Meteor.isServer) {
  // types of queries for the slides:
  // 1. meetingId
  // 2. meetingId, userId

    Timers._ensureIndex({ meetingId: 1, userId: 1 });
}

export default Timers;
