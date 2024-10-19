const mongoose = require('mongoose');
const chai = require('chai');
const Post = require('../server-side/models/Post');

const expect = chai.expect;

describe('Post Model', () => {
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
      const post = new Post();
      post.validate((err) => {
        expect(err.errors).to.have.property('title');
        expect(err.errors).to.have.property('subtitle');
        expect(err.errors).to.have.property('description');
        expect(err.errors).to.have.property('price');
        expect(err.errors).to.have.property('location');
        expect(err.errors).to.have.property('heating');
        expect(err.errors).to.have.property('roomNum');
        expect(err.errors).to.have.property('listingPurpose');
        expect(err.errors).to.have.property('square_meters');
        expect(err.errors).to.have.property('parking');
        expect(err.errors).to.have.property('indexed');
        expect(err.errors).to.have.property('coords');
        done();
      });
    });

    it('should validate a correct post', (done) => {
      const post = new Post({
        creator: mongoose.Types.ObjectId(),
        creatorType: 'User',
        title: 'Spacious Apartment for Sale',
        subtitle: 'Newly renovated, great location',
        description: 'A spacious apartment located in the heart of the city, newly renovated and ready for sale.',
        price: 500000,
        location: 'Addis Ababa',
        heating: 'central',
        roomNum: 3,
        listingPurpose: 'sale',
        square_meters: 150,
        parking: true,
        indexed: true,
        coords: ['9.03', '38.74'],
      });
      post.validate((err) => {
        expect(err).to.be.null;
        done();
      });
    });

    it('should invalidate incorrect enum values', (done) => {
      const post = new Post({
        creator: mongoose.Types.ObjectId(),
        creatorType: 'User',
        title: 'Spacious Apartment for Sale',
        subtitle: 'Newly renovated, great location',
        description: 'A spacious apartment located in the heart of the city, newly renovated and ready for sale.',
        price: 500000,
        location: 'Invalid City',
        heating: 'electric',
        roomNum: 3,
        listingPurpose: 'buying',
        square_meters: 150,
        parking: true,
        indexed: true,
        coords: ['9.03', '38.74'],
      });
      post.validate((err) => {
        expect(err.errors).to.have.property('location');
        expect(err.errors).to.have.property('heating');
        expect(err.errors).to.have.property('listingPurpose');
        done();
      });
    });
  });
});