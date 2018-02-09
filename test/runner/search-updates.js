const chai = require('chai');
const should = chai.should();
const elastic = require('../../database/elasticsearch.js');

describe('Updating Elasticsearch video data, unit tests', () => {
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