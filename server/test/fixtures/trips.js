const { Types } = require('mongoose');

const buildTrip = (overrides = {}) => ({
  _id: overrides._id || new Types.ObjectId().toHexString(),
  driver: overrides.driver || new Types.ObjectId().toHexString(),
  vehicle: overrides.vehicle || new Types.ObjectId().toHexString(),
  startLocation: 'Brisbane',
  endLocation: 'Sydney',
  startTime: overrides.startTime || new Date('2025-01-01T10:00:00Z'),
  endTime: overrides.endTime || new Date('2025-01-01T18:00:00Z'),
  ...overrides,
});

module.exports = { buildTrip };
