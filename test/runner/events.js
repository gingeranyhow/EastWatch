const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../server/index');

const ACTIONS_PATH = '/api/actions';
let searchParam = {
  "userId": 5,
  "videoId": 123212422,
  "event": "search",
  "timestamp": "2018-01-29T22:39:08+00:00",
  "search": {
    "searchId": 34
  }
};

let videoParam = {
  "userId": 5,
  "videoId": 123212422,
  "event": "videoStart",
  "timestamp": "2018-01-29T22:39:08+00:00",
  "search": {
    "searchId": 34
  }
};

let videoParamExperiment = {
  "userId": 4,
  "videoId": 123212422,
  "event": "videoComplete",
  "timestamp": "2018-01-29T22:39:08+00:00",
  "search": {
    "searchId": 34
  }
};

let emptyParam = {
};

describe('Events/Actions endpoint', () => {
  describe('Proper responses to client search actions', () => {
    it('should return a 200 when posting a search action', done => {
      chai.request(server)
        .post(`${ACTIONS_PATH}`)
        .set('content-type', 'application/json')
        .send(searchParam)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.body.acknowledged.should.eql(true);
          done();
        });
    });
    it('should return a 200 when posting a search action', done => {
      chai.request(server)
        .post(`${ACTIONS_PATH}/?userId=4`)
        .set('content-type', 'application/json')
        .send(videoParamExperiment)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.body.acknowledged.should.eql(true);
          done();
        });
    });
    it('should return a 400 when posting an empty action', done => {
      chai.request(server)
        .post(`${ACTIONS_PATH}`)
        .set('content-type', 'application/json')
        .send(emptyParam)
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          done();
        });
    });
  }),
  describe('Test Message Bus for actions', () => {
    xit('should post a message bus message with correct bucketID', done => {
    });
  });
});