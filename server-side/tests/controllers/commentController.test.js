const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { comment, answerComment, deleteComment, deleteAnswer } = require('../server-side/controllers/commentController');
const Post = require('../server-side/models/Post');
const Comment = require('../server-side/models/Comment');
const AppError = require('../server-side/utilities/AppError');

const expect = chai.expect;
chai.use(sinonChai);

describe('commentController', () => {
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

  afterEach(() => {
    sinon.restore();
  });

  describe('comment', () => {
    it('should post a comment', async () => {
      const req = {
        body: { comment: 'This is a comment' },
        params: { postId: 'postId' },
        user: { id: 'userId', email: 'user@example.com', role: 'user' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const post = {
        id: 'postId',
        creator: { email: 'creator@example.com' },
        comments: [],
        save: sinon.stub().resolves(),
      };

      sinon.stub(Post, 'findById').resolves(post);
      sinon.stub(Comment, 'create').resolves({ id: 'commentId' });

      await comment(req, res, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'You have successfully posted a public comment!',
      });
    });

    it('should return an error if comment is missing', async () => {
      const req = { body: {} };
      const res = {};
      const next = sinon.stub();

      await comment(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('answerComment', () => {
    it('should post an answer to a comment', async () => {
      const req = {
        body: { answer: 'This is an answer' },
        params: { commentId: 'commentId' },
        user: { email: 'creator@example.com' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const comment = {
        post: { creator: { email: 'creator@example.com' } },
        save: sinon.stub().resolves(),
      };

      sinon.stub(Comment, 'findById').resolves(comment);

      await answerComment(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'You have successfully posted an answer to the question',
      });
    });

    it('should return an error if user does not have permission', async () => {
      const req = {
        body: { answer: 'This is an answer' },
        params: { commentId: 'commentId' },
        user: { email: 'user@example.com' },
      };
      const res = {};
      const next = sinon.stub();

      const comment = {
        post: { creator: { email: 'creator@example.com' } },
      };

      sinon.stub(Comment, 'findById').resolves(comment);

      await answerComment(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const req = {
        params: { commentId: 'commentId' },
        user: { _id: 'userId' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const comment = {
        creator: 'userId',
      };

      sinon.stub(Comment, 'findById').resolves(comment);
      sinon.stub(Comment, 'findByIdAndDelete').resolves();

      await deleteComment(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'Public question deleted',
      });
    });

    it('should return an error if user does not have permission', async () => {
      const req = {
        params: { commentId: 'commentId' },
        user: { _id: 'userId' },
      };
      const res = {};
      const next = sinon.stub();

      const comment = {
        creator: 'otherUserId',
      };

      sinon.stub(Comment, 'findById').resolves(comment);

      await deleteComment(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('deleteAnswer', () => {
    it('should delete an answer', async () => {
      const req = {
        params: { commentId: 'commentId' },
        user: { _id: 'creatorId' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const comment = {
        post: { creator: { _id: 'creatorId' } },
        save: sinon.stub().resolves(),
      };

      sinon.stub(Comment, 'findById').resolves(comment);

      await deleteAnswer(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'Answer deleted',
      });
    });

    it('should return an error if user does not have permission', async () => {
      const req = {
        params: { commentId: 'commentId' },
        user: { _id: 'userId' },
      };
      const res = {};
      const next = sinon.stub();

      const comment = {
        post: { creator: { _id: 'creatorId' } },
      };

      sinon.stub(Comment, 'findById').resolves(comment);

      await deleteAnswer(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });
});