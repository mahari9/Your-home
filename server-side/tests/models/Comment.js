const mongoose = require('mongoose');
const chai = require('chai');
const Comment = require('../server-side/models/Comment');

const expect = chai.expect;

describe('Comment Model', () => {
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
      const comment = new Comment();
      comment.validate((err) => {
        expect(err.errors).to.have.property('comment');
        done();
      });
    });

    it('should validate a correct comment', (done) => {
      const comment = new Comment({
        creator: mongoose.Types.ObjectId(),
        creatorType: 'User',
        comment: 'This is a test comment',
        post: mongoose.Types.ObjectId(),
      });
      comment.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should invalidate incorrect enum values for creatorType', (done) => {
      const comment = new Comment({
        creator: mongoose.Types.ObjectId(),
        creatorType: 'InvalidType',
        comment: 'This is a test comment',
        post: mongoose.Types.ObjectId(),
      });
      comment.validate((err) => {
        expect(err.errors).to.have.property('creatorType');
        done();
      });
    });
  });
});