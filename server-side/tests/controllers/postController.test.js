const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const sharp = require('sharp');
const { validationResult } = require('express-validator');
const { createPost, queryPosts, querySinglePost, deletePost, finishPost, getAllPosts } = require('../server-side/controllers/postController');
const Post = require('../server-side/models/Post');
const User = require('../server-side/models/User');
const Agency = require('../server-side/models/Agency');
const AppError = require('../server-side/utilities/AppError');

const expect = chai.expect;
chai.use(sinon-chai);

describe('postController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: {},
      files: []
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createPost', () => {
    it('should create a post with valid data', async () => {
      req.body = { floor: 1, typeProperty: 'apartment' };
      req.user = { id: 'userId', role: 'user' };
      req.files = [{ mimetype: 'image/jpeg', originalname: 'test.jpg', buffer: Buffer.from('') }];
      const user = { posts: [], save: sinon.stub().resolves() };
      const post = { imgs: [], save: sinon.stub().resolves() };

      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);
      sinon.stub(Post, 'create').resolves(post);
      sinon.stub(sharp.prototype, 'resize').returnsThis();
      sinon.stub(sharp.prototype, 'toFormat').returnsThis();
      sinon.stub(sharp.prototype, 'jpeg').returnsThis();
      sinon.stub(sharp.prototype, 'toFile').resolves();

      await createPost(req, res, next);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'You have successfully posted an ad!'
      });
    });

    it('should return error if no files are attached', async () => {
      await createPost(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });

    it('should return error if floor is not specified', async () => {
      req.files = [{ mimetype: 'image/jpeg', originalname: 'test.jpg', buffer: Buffer.from('') }];
      await createPost(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('queryPosts', () => {
    it('should return filtered posts', async () => {
      req.query = { pricegte: 1000, pricelte: 2000, page: 1 };
      const posts = [{ _id: 'postId' }];

      sinon.stub(Post, 'find').returns({ limit: sinon.stub().returnsThis(), skip: sinon.stub().returnsThis(), sort: sinon.stub().returns(posts) });

      await queryPosts(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        posts,
        total: posts.length,
        left: posts.length - 9
      });
    });
  });

  describe('querySinglePost', () => {
    it('should return a single post', async () => {
      req.params = { postId: 'postId' };
      const post = { comments: [], populate: sinon.stub().returnsThis() };

      sinon.stub(validationResult, 'withDefaults').returns({ errors: [] });
      sinon.stub(Post, 'findOne').resolves(post);

      await querySinglePost(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ post });
    });

    it('should return error if post id is invalid', async () => {
      sinon.stub(validationResult, 'withDefaults').returns({ errors: [{}] });

      await querySinglePost(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      req.params = { postId: 'postId' };
      req.user = { _id: 'userId' };
      const post = { creator: 'userId' };

      sinon.stub(Post, 'findById').resolves(post);
      sinon.stub(Post, 'findByIdAndDelete').resolves();

      await deletePost(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'Post successfully deleted'
      });
    });

    it('should return error if user lacks permission', async () => {
      req.params = { postId: 'postId' };
      req.user = { _id: 'userId' };
      const post = { creator: 'otherUserId' };

      sinon.stub(Post, 'findById').resolves(post);

      await deletePost(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('finishPost', () => {
    it('should mark a post as finished', async () => {
      req.params = { postId: 'postId' };
      const post = { finished: false, save: sinon.stub().resolves() };

      sinon.stub(Post, 'findById').resolves(post);

      await finishPost(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'Listing successfully completed'
      });
    });
  });

  describe('getAllPosts', () => {
    it('should return all unfinished posts', async () => {
      const posts = [{ _id: 'postId' }];

      sinon.stub(Post, 'find').resolves(posts);

      await getAllPosts(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ posts });
    });
  });
});