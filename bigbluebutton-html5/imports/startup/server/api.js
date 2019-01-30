import Meetings from '/imports/api/meetings';
import Users from '/imports/api/users';
import Slides from '/imports/api/slides';

class Response {
  static getJSONString(_code, _message, _data) {
    return JSON.stringify({
      code: _code,
      message: _message,
      data: _data,
    });
  }
}

const CONNECT_HANDLERS = WebApp.connectHandlers;
const SUCCESS_MESSAGE = 'success';
const NULL_RESPONSE = Response.getJSONString(100, 'Params incorrect', null);

CONNECT_HANDLERS.use('/api/test', (req, res) => {
  res.end('Success');
});
// Get meeting by name
CONNECT_HANDLERS.use('/api/meetings', (req, res) => {
  req.on('data', Meteor.bindEnvironment((data) => {
    res.setHeader('Content-type', 'application/json');
    const body = JSON.parse(data);
    if (!body.name) res.end(NULL_RESPONSE);
    const meeting = Meetings.findOne({ 'meetingProp.name': body.name });
    if (!meeting) res.end(Response.getJSONString(101, 'Result not found', null));
    res.end(Response.getJSONString(200, SUCCESS_MESSAGE, meeting));
  }));
});
// Get meeting by id
CONNECT_HANDLERS.use('/api/meeting', (req, res) => {
  req.on('data', Meteor.bindEnvironment((data) => {
    res.setHeader('Content-type', 'application/json');
    const body = JSON.parse(data);
    if (!body.id) res.end(NULL_RESPONSE);
    console.log(body.id);
    const meeting = Meetings.findOne({ meetingId: body.id });
    if (!meeting) res.end(Response.getJSONString(101, 'Result not found', null));
    res.end(Response.getJSONString(200, SUCCESS_MESSAGE, meeting));
  }));
});
// Get user by id
CONNECT_HANDLERS.use('/api/users', (req, res) => {
  req.on('data', Meteor.bindEnvironment((data) => {
    res.setHeader('Content-type', 'application/json');
    const body = JSON.parse(data);
    if (!body.id) res.end(NULL_RESPONSE);
    const user = Users.findOne({ userId: body.id });
    if (!user) res.end(Response.getJSONString(101, 'Result not found', null));
    res.end(Response.getJSONString(200, SUCCESS_MESSAGE, user));
  }));
});
// Get slide by id
CONNECT_HANDLERS.use('/api/slider', (req, res) => {
  console.log('call /api/slider');
  req.on('data', Meteor.bindEnvironment((data) => {
    res.setHeader('Content-type', 'application/json');
    const body = JSON.parse(data);
    if (!body.id) res.end(NULL_RESPONSE);
    const slide = Slides.find({ id: body.id });
    if (!slide) res.end(Response.getJSONString(101, 'Result not found', null));
    res.end(Response.getJSONString(200, SUCCESS_MESSAGE, slide));
  }));
});

