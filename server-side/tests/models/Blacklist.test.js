const mongoose = require('mongoose');
const chai = require('chai');
const Blacklist = require('../server-side/models/Blacklist');

const expect = chai.expect;

describe('Blacklist Model', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Field validations', () => {
    it('should be invalid if token is missing', (done) => {
      const blacklist = new Blacklist();
      blacklist.validate((err) => {
        expect(err.errors).to.have.property('token');
        done();
      });
    });

    it('should validate a correct blacklist entry', (done) => {
      const blacklist = new Blacklist({
        token: 'some-valid-token',
      });
      blacklist.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });
  });
});