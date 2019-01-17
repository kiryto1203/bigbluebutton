import RedisPubSub from '/imports/startup/server/redis';
import handleActionTimer from "./handlers/actionTimer";

RedisPubSub.on('doActionTimerPubMsg', handleActionTimer);
