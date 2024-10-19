const mongoose = require('mongoose');
const chai = require('chai');
const Agency = require('../server-side/models/Agency');

const expect = chai.expect;

describe('Agency Model', () => {
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
    it('should be invalid if required fields are missing', (done) => {
      const agency = new Agency();
      agency.validate((err) => {
        expect(err.errors).to.have.property('agencyName');
        expect(err.errors).to.have.property('contactPerson');
        expect(err.errors).to.have.property('email');
        expect(err.errors).to.have.property('password');
        expect(err.errors).to.have.property('passwordConfirm');
        done();
      });
    });

    it('should validate a correct agency', (done) => {
      const agency = new Agency({
        agencyName: 'Best Agency',
        contactPerson: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      agency.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should invalidate incorrect email format', (done) => {
      const agency = new Agency({
        agencyName: 'Best Agency',
        contactPerson: 'John Doe',
        email: 'john.doe@com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      agency.validate((err) => {
        expect(err.errors).to.have.property('email');
        done();
      });
    });

    it('should invalidate mismatched passwords', (done) => {
      const agency = new Agency({
        agencyName: 'Best Agency',
        contactPerson: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password456',
      });
      agency.validate((err) => {
        expect(err.errors).to.have.property('passwordConfirm');
        done();
      });
    });

    it('should hash the password before saving', async () => {
      const agency = new Agency({
        agencyName: 'Best Agency',
        contactPerson: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      await agency.save();
      expect(agency.password).to.not.equal('password123');
    });
  });
});