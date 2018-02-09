const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../server/index');
const abService = require('../../server/controllers/helpers/abService.js');

const VIDEO_PATH = '/api/video';

describe('Test A/B Placement', () => {
  it('should put users in experiment bucket', () => {
    let experimentalUserIds = [4, 9, 1231343234];
    // Get initial View count
    experimentalUserIds.forEach(userId => {
      abService(userId).should.equal(2);
    });
  });
  it('should put users in default bucket', () => {
    let defaultUserIds = [1, 100, 10000, 89823943];
    // Get initial View count
    defaultUserIds.forEach(userId => {
      abService(userId).should.equal(1);
    });
  });
  it('should assign non-logged-in users to default, if passed', () => {
    // Get initial View count
    abService().should.equal(1);
  });
});

let videoId;

describe('Test Video Endpoint', () => {
  it('should return a video if it exists', done => {
    videoId = 9;
    chai.request(server)
      .get(`${VIDEO_PATH}/${videoId}`)
      .end((err, res) => {
        console.log('testing', res.status, res.data);
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.data.video.videoId.should.eql(videoId);
        res.body.data.video.should.include.keys('videoId', 'views', 'videoUrl');
        done();
      });
  });
  it('should return 404 if video is not found', done => {
    videoId = 6666666666666;
    chai.request(server)
      .get(`${VIDEO_PATH}/${videoId}`)
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(404);
        done();
      });
   
  });
  it('should return 404 if no video id is passed', done => {
    chai.request(server)
      .get(`${VIDEO_PATH}`)
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(404);
        done();
      });
  });
});
