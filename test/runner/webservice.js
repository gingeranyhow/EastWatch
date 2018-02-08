const chai = require('chai');
const should = chai.should();
const abService = require('../../server/controllers/helpers/abService.js');

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
