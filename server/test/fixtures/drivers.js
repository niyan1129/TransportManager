const { Types } = require('mongoose');

const buildDriver = (overrides = {}) => ({
  _id: overrides._id || new Types.ObjectId().toHexString(),
  firstName: 'John',
  lastName: 'Doe',
  licenceNumber: 'ABC123',
  ...overrides,
});

module.exports = { buildDriver };
