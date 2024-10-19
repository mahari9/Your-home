const chai = require('chai');
const AppError = require('../server-side/utilities/AppError');

const expect = chai.expect;

describe('AppError', () => {
  it('should create an error with statusCode and message', () => {
    const statusCode = 404;
    const errMsg = 'Not Found';
    const error = new AppError(statusCode, errMsg);

    expect(error).to.be.instanceOf(Error);
    expect(error).to.have.property('statusCode', statusCode);
    expect(error).to.have.property('message', errMsg);
    expect(error).to.have.property('isOperational', true);
  });

  it('should have the correct prototype chain', () => {
    const statusCode = 500;
    const errMsg = 'Internal Server Error';
    const error = new AppError(statusCode, errMsg);

    expect(error).to.be.instanceOf(AppError);
    expect(error).to.be.instanceOf(Error);
    expect(Object.getPrototypeOf(error)).to.equal(AppError.prototype);
  });
});