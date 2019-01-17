import mapToAcl from '/imports/startup/mapToAcl';
import { Meteor } from 'meteor/meteor';
import doActionTimer from './methods/doActionTimer';
import getServerTime from './methods/getServerTime';

Meteor.methods(mapToAcl(['methods.doActionTimer', 'methods.getServerTime'], { doActionTimer, getServerTime }));
