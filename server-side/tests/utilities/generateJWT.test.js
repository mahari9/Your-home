const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const generateJWT = require('../server-side/utilities/generateJWT');

const expect = chai.expect;

describe('generateJWT', () => {
  let res;

  beforeEach(() => {
    res = {
      cookie: sinon.spy()
    };
  });

  it('should generate a JWT token and set a cookie', () => {
    const id = '12345';
    const token = generateJWT(id, res);
    
    expect(token).to.be.a('string');
    expect(jwt.verify(token, process.env.JWT_SECRET).id).to.equal(id);
    expect(res.cookie.calledOnce).to.be.true;
    expect(res.cookie.firstCall.args[0]).to.equal('jwt');
    expect(res.cookie.firstCall.args[1]).to.equal(token);
    expect(res.cookie.firstCall.args[2]).to.have.property('expires');
  });

  it('should set cookie expiration date to 60 days from now', () => {
    const id = '12345';
    generateJWT(id, res);
    
    const expires = res.cookie.firstCall.args[2].expires;
    const expectedExpirationDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    
    expect(Math.abs(expires.getTime() - expectedExpirationDate.getTime())).to.be.lessThan(1000); // Allow 1 second difference
  });
});