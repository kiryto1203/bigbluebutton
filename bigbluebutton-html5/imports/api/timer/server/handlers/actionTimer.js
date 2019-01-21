import { check } from 'meteor/check';
import addTimer from "../modifiers/addTimer";

export default function handleActionTimer({ header, body }, meetingId) {
    const timer = body;
    check(meetingId, String);
    check(header.userId, String);

    timer.userId = header.userId;
    return addTimer(meetingId, timer);
}
