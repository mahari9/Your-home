const chai = require('chai');
const sinon = require('sinon');
const catchAsync = require('../server-side/utilities/catchAsync');

const expect = chai.expect;

describe('catchAsync', () => {
  it('should call next with an error when the function throws an error', async () => {
    const error = new Error('Test error');
    const fn = sinon.stub().rejects(error);
    const next = sinon.spy();

    const middleware = catchAsync(fn);
    await middleware({}, {}, next);

    expect(next.calledOnce).to.be.true;
    expect(next.calledWith(error)).to.be.true;
  });

  it('should call the function with req, res, and next', async () => {
    const fn = sinon.stub().resolves();
    const next = sinon.spy();
    const req = {};
    const res = {};

    const middleware = catchAsync(fn);
    await middleware(req, res, next);

    expect(fn.calledOnce).to.be.true;
    expect(fn.calledWith(req, res, next)).to.be.true;
    expect(next.called).to.be.false;
  });
});