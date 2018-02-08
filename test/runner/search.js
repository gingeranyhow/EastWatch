const server = require('../../server/index');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const PATH = '/api/search';

describe('Return proper search results', () => {
  describe('GET results for garage', () => {
    it('should return 10 results for users in default bucket', done => {
      chai.request(server)
        .get(`${PATH}/?query=garage`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.data.items.length.should.eql(10);
          res.body.data.count.should.eql(10);
          res.body.data.trends.should.eql(false);
          res.body.data.items[0].should.include.keys('videoId', 'views');
          done();
        });
    });

    it('should return 10 results for Experimental Bucket', done => {
      chai.request(server)
        .get(`${PATH}/?query=garage&userId=4`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.data.items.length.should.eql(10);
          res.body.data.count.should.eql(10);
          res.body.data.trends.should.eql(true);
          res.body.data.items[0].should.include.keys('videoId', 'views');
          done();
        });
    });
  });


  describe('GET results for long, nonsense word aljdflj123431kl2312', () => {
    it('should return no results for people in default bucket', done => {
      chai.request(server)
        .get(`${PATH}/?query=aljdflj123431kl2312`)
        .end((err, res) => {
          console.log('results:', res.body.data.count);
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.data.items.length.should.eql(0);
          res.body.data.count.should.eql(0);
          done();
        });
    });

    it('should return 3 results for user in experimental bucket', done => {
      chai.request(server)
        .get(`${PATH}/?query=aljdflj123431kl2312&userId=4`)
        .end((err, res) => {
          console.log('results:', res.body.data.count);
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.data.items.length.should.eql(3);
          res.body.data.count.should.eql(3);
          done();
        });
    });
  });

  describe('Attempt a search result without a query', () => {
    it('should return an error without userid', done => {
      chai.request(server)
        .get(`${PATH}`)
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          res.type.should.eql('text/plain');
          done();
        });
    });
    it('should return an error with userid', done => {
      chai.request(server)
        .get(`${PATH}/?userId=4`)
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          res.type.should.eql('text/plain');
          done();
        });
    });
  });
});