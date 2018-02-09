const chai = require('chai');
const should = chai.should();
const elastic = require('../../database/elasticsearch.js');
const sqsReceive = require('../../server/controllers/helpers/sqs-receive.js');
const sqsSend = require('../../server/controllers/helpers/sqs-send.js');
const messageBusController = require('../../server/controllers/messageBusControllers.js');
const serviceEndpoints = require('../../server/controllers/helpers/endpoint-routes.js');

describe('Unit Test: Updating Elasticsearch video data', () => {
  describe('update view count by 10', () => {
    let videoId = 1;
    it('should return updated count', done => {
      // Get initial View count
      elastic.lookupById(videoId)
        .then(results => {
          let initialView = results.views;

          let updateObject = [{
            videoId: videoId,
            views: initialView + 10
          }];

          // Update views
          return Promise.all([initialView, elastic.updateElasticVideoData(updateObject, 'update')]);
        })
        .then(([initialView, results]) => {
          return Promise.all([initialView, elastic.lookupById(videoId)]);
        })
        .then(([initialView, results]) => {
          results.views.should.equal(initialView + 10);
          done();
        })
        .catch(err => console.error(err));
    });
  });
  describe('update view count in bulk', () => {
    let videoId = 14;
    let updateBy = 50;
    it('should return updated count', done => {
      // Get initial View count
      elastic.lookupById(videoId)
        .then(results => {
          let initialView = results.views;

          let updateObject = [{
            videoId: 99,
            views: initialView + updateBy
          },
          {
            videoId: videoId,
            views: initialView + updateBy
          },
          {
            videoId: 100,
            views: initialView + updateBy
          }];

          // Update views
          return Promise.all([initialView, elastic.updateElasticVideoData(updateObject, 'update')]);
        })
        .then(([initialView, results]) => {
          return Promise.all([initialView, elastic.lookupById(videoId)]);
        })
        .then(([initialView, results]) => {
          results.views.should.equal(initialView + updateBy);
          done();
        })
        .catch(err => console.error(err));
    });
  });
  describe('add and delete a video', () => {
    let videoId = 10666666;
    let video = {
      videoId: videoId,
      views: 0,
      title: 'bananazzzzzzzzzzzzzzzz',
      description: 'bananazzzzzzzzzzzzzzzz'
    };
    it('should add a video', done => {

      elastic.lookupById(videoId)
        .then(results => {
          should.not.exist(results);
          return elastic.updateElasticVideoData([video], 'create');
        })
        .then(() => {
          return elastic.lookupById(videoId);
        })
        .then(results => {
          should.exist(results.videoId);
          results.videoId.should.eql(videoId);
          results.title.should.eql(video.title);
          results.description.should.eql(video.description);

          // clean up by deleting
          return elastic.updateElasticVideoData([video], 'delete');
        })
        .then(() => {  
          return elastic.lookupById(videoId);
          
        })
        .then((results) => {
          should.not.exist(results);
          done();
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
});

describe('Integration Test via MB: Updating Elasticsearch video data', () => {
  describe('update view count in bulk', () => {
    let videoId = 10000666;

    let videoToCreate = [{
      videoId: videoId,
      title: 'dobyz',
      views: 2
    }];

    let videoToUpdate = [{
      videoId: videoId,
      views: 22
    }];

    let messageAttributes = {
      "event": {
        DataType: "String",
        StringValue: "update"
      }
    };

    it('should return updated count', function(done) {
      // Create the test video
      this.timeout(10000);
      elastic.updateElasticVideoData(videoToCreate, 'create')
        .then(() => {
          // Add a message to the Queue with the update object
          return sqsSend.addToQueue(serviceEndpoints.incomingVideoSQS, videoToUpdate, messageAttributes);
        })
        .then(() => {
          // Trigger a pull/process from the same Queue
          messageBusController.kickoff();
          return;
        })
        .then(() => {
          // Lookup the video in question by ID
          this.timeout(1500);
          return elastic.lookupById(videoId);
        })
        .then((results) => {
          console.log('results:', results);
          should.exist(results.videoId);
          results.videoId.should.eql(results.videoId);
          results.title.should.eql(videoToCreate[0].title);
          results.views.should.eql(videoToUpdate[0].views);
          // Clean up by deleting video
          return elastic.updateElasticVideoData([{videoId: videoId}], 'delete');
        })
        .then(() => done())
        .catch(err => console.error(err));
    });
  });
});


