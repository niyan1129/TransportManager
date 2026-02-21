const { Types } = require('mongoose');

const buildVehicle = (overrides = {}) => ({
  _id: overrides._id || new Types.ObjectId().toHexString(),
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  plateNumber: 'PLT123',
  driver: overrides.driver || new Types.ObjectId().toHexString(),
  ...overrides,
});

module.exports = { buildVehicle };
