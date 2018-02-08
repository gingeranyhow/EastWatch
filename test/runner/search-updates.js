const chai = require('chai');
const should = chai.should();
const elastic = require('../../database/elasticsearch.js');

describe('Change view count for video', () => {
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
          return Promise.all([initialView, elastic.updateViews(updateObject)]);
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
});