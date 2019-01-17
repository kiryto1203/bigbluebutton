import flat from 'flat';
import Timers from '/imports/api/timer';
import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';
import { BREAK_LINE } from '/imports/utils/lineEndings';

export default function addTimer(meetingId, timer) {
    check(timer, {
        actionName: String,
        userId: String,
        username: String,
        createdAt: Number
    });

    const selector = {
        meetingId,
        userId: timer.username,
    };

    const modifier = {
        $set: Object.assign(
            flat(timer, { safe: true }),
            {
                meetingId,
                actionName: timer.actionName,
                username: timer.username,
                createdAt: timer.createdAt
            },
        ),
    };

    const cb = (err, numChanged) => {
        if (err) {
            return Logger.error(`Adding timer to collection: ${err}`);
        }

        const { insertedId } = numChanged;

        if (insertedId) {
            return Logger.info(`Added timer to do action ${timer.actionName} by username ${timer.username} at ${timer.createdAt}`);
        }

        return Logger.info(`Upserted timer to do action ${timer.actionName} by username ${timer.username} at ${timer.createdAt}`);
    };

    return Timers.upsert(selector, modifier, cb);
}
