const server = require('../server/index');

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const PATH = '/api/search';

describe('routes: search', () => {
  describe(`GET ${PATH}/?query=garage`, () => {
    it('should return full resources', done => {
      chai.request(server)
        .get(`${PATH}/?query=garage`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.data.items.length.should.eql(10);
          res.body.data.count.should.eql(10);
          res.body.data.items[0].should.include.keys('videoId', 'views');
          done();
        });
    });
  });

  describe(`GET ${PATH}/?query=aljdflj123431kl2312`, () => {
    it('should return emtpy resources', done => {
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
  });

  describe(`GET ${PATH} without query`, () => {
    it('should return error', done => {
      chai.request(server)
        .get(`${PATH}`)
        .end((err, res) => {
          should.exist(err);
          res.status.should.eql(400);
          res.type.should.eql('text/plain');
          done();
        });
    });
  });
});