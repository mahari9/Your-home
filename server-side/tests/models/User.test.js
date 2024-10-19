const mongoose = require('mongoose');
const chai = require('chai');
const bcrypt = require('bcrypt');
const User = require('../server-side/models/User');

const expect = chai.expect;

describe('User Model', () => {
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
      const user = new User();
      user.validate((err) => {
        expect(err.errors).to.have.property('fullName');
        expect(err.errors).to.have.property('location');
        expect(err.errors).to.have.property('email');
        expect(err.errors).to.have.property('password');
        expect(err.errors).to.have.property('passwordConfirm');
        done();
      });
    });

    it('should validate a correct user', (done) => {
      const user = new User({
        fullName: 'John Doe',
        location: 'Addis Ababa',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      user.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should invalidate incorrect email format', (done) => {
      const user = new User({
        fullName: 'John Doe',
        location: 'Addis Ababa',
        email: 'john.doe@com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      user.validate((err) => {
        expect(err.errors).to.have.property('email');
        done();
      });
    });

    it('should invalidate mismatched passwords', (done) => {
      const user = new User({
        fullName: 'John Doe',
        location: 'Addis Ababa',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password456',
      });
      user.validate((err) => {
        expect(err.errors).to.have.property('passwordConfirm');
        done();
      });
    });

    it('should hash the password before saving', async () => {
      const user = new User({
        fullName: 'John Doe',
        location: 'Addis Ababa',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      await user.save();
      expect(user.password).to.not.equal('password123');
      const isMatch = await bcrypt.compare('password123', user.password);
      expect(isMatch).to.be.true;
    });
  });
});