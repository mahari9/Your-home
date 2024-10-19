const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { register, login, protect, registerAgency, loginAgency, verify, makeReview, getProfileData, rateProfile, logout } = require('../server-side/controllers/authController');
const User = require('../server-side/models/User');
const Agency = require('../server-side/models/Agency');
const Blacklist = require('../server-side/models/Blacklist');
const generateJWT = require('../server-side/utilities/generateJWT');
const AppError = require('../server-side/utilities/AppError');

const expect = chai.expect;
chai.use(sinonChai);

describe('authController', () => {
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

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      const req = {
        body: {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      sinon.stub(User, 'checkFields').returns(true);
      sinon.stub(User, 'create').resolves(req.body);
      sinon.stub(generateJWT, 'default').returns('token');

      await register(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'John Doe, welcome!',
        token: 'token',
      });
    });

    it('should return an error if required fields are missing', async () => {
      const req = { body: {} };
      const res = {};
      const next = sinon.stub();

      sinon.stub(User, 'checkFields').returns(false);

      await register(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const req = {
        body: {
          email: 'john.doe@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const user = {
        email: 'john.doe@example.com',
        password: 'password123',
        id: 'userId',
      };

      sinon.stub(User, 'findOne').resolves(user);
      sinon.stub(Agency, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(generateJWT, 'default').returns('token');

      await login(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'You have successfully logged in',
        token: 'token',
      });
    });

    it('should return an error if email or password are missing', async () => {
      const req = { body: {} };
      const res = {};
      const next = sinon.stub();

      await login(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('protect', () => {
    it('should protect a route and attach user to req', async () => {
      const req = {
        cookies: { jwt: 'token' },
      };
      const res = {};
      const next = sinon.stub();

      const user = {
        id: 'userId',
        hasChangedPassword: sinon.stub().returns(false),
      };

      sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => callback(null, { id: 'userId' }));
      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);

      await protect(req, res, next);

      expect(req.user).to.equal(user);
      expect(next).to.have.been.called;
    });

    it('should return an error if token is invalid', async () => {
      const req = {
        cookies: { jwt: 'invalidToken' },
      };
      const res = {};
      const next = sinon.stub();

      sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => callback(new Error('Invalid token'), null));

      await protect(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('registerAgency', () => {
    it('should register a new agency and return a token', async () => {
      const req = {
        body: {
          agencyName: 'Test Agency',
          email: 'agency@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      sinon.stub(Agency, 'checkFields').returns(true);
      sinon.stub(Agency, 'create').resolves(req.body);
      sinon.stub(generateJWT, 'default').returns('token');

      await registerAgency(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'Test Agency, welcome!',
        token: 'token',
      });
    });

    it('should return an error if required fields are missing', async () => {
      const req = { body: {} };
      const res = {};
      const next = sinon.stub();

      sinon.stub(Agency, 'checkFields').returns(false);

      await registerAgency(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('loginAgency', () => {
    it('should login an agency and return a token', async () => {
      const req = {
        body: {
          email: 'agency@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const agency = {
        email: 'agency@example.com',
        password: 'password123',
        id: 'agencyId',
      };

      sinon.stub(Agency, 'findOne').resolves(agency);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(generateJWT, 'default').returns('token');

      await loginAgency(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: "You're successfully logged in",
        token: 'token',
      });
    });

    it('should return an error if email or password are missing', async () => {
      const req = { body: {} };
      const res = {};
      const next = sinon.stub();

      await loginAgency(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('verify', () => {
    it('should verify a token and return user data', async () => {
      const req = {
        cookies: { jwt: 'token' },
        headers: { cookie: 'jwt=token' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const user = {
        id: 'userId',
        hasChangedPassword: sinon.stub().returns(false),
      };

      sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => callback(null, { id: 'userId' }));
      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);
      sinon.stub(Blacklist, 'findOne').resolves(null);

      await verify(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        user,
      });
    });

    it('should return an error if token is invalid', async () => {
      const req = {
        cookies: { jwt: 'invalidToken' },
        headers: { cookie: 'jwt=invalidToken' },
      };
      const res = {};
      const next = sinon.stub();

      sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => callback(new Error('Invalid token'), null));

      await verify(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('makeReview', () => {
    it('should make a review for a profile', async () => {
      const req = {
        params: { profileId: 'profileId' },
        user: { _id: 'userId' },
        body: { reviewType: 'positive' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const user = {
        _id: 'profileId',
        reviews: [],
        save: sinon.stub().resolves(),
      };

      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);

      await makeReview(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'You have successfully rated the profile',
      });
    });

    it('should return an error if user tries to rate their own profile', async () => {
      const req = {
        params: { profileId: 'userId' },
        user: { _id: 'userId' },
      };
      const res = {};
      const next = sinon.stub();

      const user = {
        _id: 'userId',
      };

      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);

      await makeReview(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('getProfileData', () => {
    it('should get profile data of a user or agency', async () => {
      const req = {
        params: { profileId: 'profileId' },
        body: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const user = {
        _id: 'profileId',
        select: sinon.stub().returnsThis(),
        populate: sinon.stub().returnsThis(),
      };

      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);
      sinon.stub(validationResult, 'withDefaults').returns({ errors: [] });

      await getProfileData(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        validProfile: user,
      });
    });

    it('should return an error if profile ID is invalid', async () => {
      const req = {
        params: { profileId: 'invalidId' },
      };
      const res = {};
      const next = sinon.stub();

      sinon.stub(validationResult, 'withDefaults').returns({ errors: [{}] });

      await getProfileData(req, res, next);

      expect(next).to.have.been.calledWith(sinon.match.instanceOf(AppError));
    });
  });

  describe('rateProfile', () => {
    it('should rate a profile', async () => {
      const req = {
        params: { profileId: 'profileId' },
        user: { _id: 'userId' },
        body: { reviewType: 'positive' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const user = {
        _id: 'profileId',
        reviews: [],
        save: sinon.stub().resolves(),
      };

      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(Agency, 'findById').resolves(null);

      await rateProfile(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
      });
    });
  });

  describe('logout', () => {
    it('should logout a user and blacklist the token', async () => {
      const req = {
        headers: { cookie: 'jwt=token' },
      };
      const res = {
        setHeader: sinon.stub(),
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      sinon.stub(Blacklist, 'findOne').resolves(null);
      sinon.stub(Blacklist, 'create').resolves({});

      await logout(req, res, next);

      expect(res.setHeader).to.have.been.calledWith('Clear-Site-Data', '"cookies"');
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        status: 'success',
        message: 'Logout successful!',
      });
    });

    it('should return no content if token is already blacklisted', async () => {
      const req = {
        headers: { cookie: 'jwt=token' },
      };
      const res = {
        sendStatus: sinon.stub(),
      };
      const next = sinon.stub();

      sinon.stub(Blacklist, 'findOne').resolves({});

      await logout(req, res, next);

      expect(res.sendStatus).to.have.been.calledWith(204);
    });
  });
});