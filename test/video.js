const server = require('../server/index');

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const PATH = '/api/video';

describe(`GET ${PATH}/:id`, () => {
  it("should return a single resource", done => {
    chai
      .request(server)
      .get(`${PATH}/1`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql("application/json");
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys("id", "title", "body", "tags");
        done();
      });
  });
  it("should return an error when the requested video does not exists", done => {
    chai
      .request(server)
      .get(`${PATH}/999999999999`)
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(404);
        res.type.should.eql("application/json");
        res.body.error.should.eql("The requested resource does not exists");
        done();
      });
  });
});