const chai = require('chai');
const sinon = require('sinon');
const errorController = require('../server-side/controllers/errorController');

const expect = chai.expect;

describe('errorController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  describe('when in development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should return detailed error information', () => {
      const err = new Error('Test error');
      err.statusCode = 400;

      errorController(err, req, res, next);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({
        status: 'fail',
        message: 'Test error',
        err,
        stack: err.stack,
      });
    });
  });

  describe('when in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should handle validation errors', () => {
      const err = {
        name: 'ValidationError',
        errors: {
          field: { message: 'Validation error on field' },
        },
      };

      errorController(err, req, res, next);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({
        status: 'fail',
        message: 'Validation error on field',
      });
    });

    it('should handle duplicate key errors', () => {
      const err = {
        code: 11000,
        keyValue: { field: 'value' },
      };

      errorController(err, req, res, next);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({
        status: 'fail',
        message: 'field Is already in use.',
      });
    });

    it('should handle operational errors', () => {
      const err = {
        isOperational: true,
        statusCode: 404,
        message: 'Operational error',
      };

      errorController(err, req, res, next);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        status: 'fail',
        message: 'Operational error',
      });
    });

    it('should handle unknown errors', () => {
      const err = new Error('Unknown error');

      errorController(err, req, res, next);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        status: 'error',
        message: 'Something went wrong!',
      });
    });
  });
});