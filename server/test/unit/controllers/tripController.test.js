jest.mock('../../../src/models/trip', () => ({}));
jest.mock('../../../src/utils/generatePaginationLinks', () => ({
  generatePaginationLinks: jest.fn(),
}));

const Trip = require('../../../src/models/trip');
const { generatePaginationLinks } = require('../../../src/utils/generatePaginationLinks');
const tripController = require('../../../src/controllers/tripController');
const { buildTrip } = require('../../fixtures/trips');
const { Types } = require('mongoose');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('tripController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Trip.paginate = jest.fn();
    Trip.findById = jest.fn();
    Trip.findOne = jest.fn();
    Trip.create = jest.fn();
    Trip.findByIdAndUpdate = jest.fn();
    Trip.findByIdAndDelete = jest.fn();
  });

  describe('getAllTrips', () => {
    it('returns paginated trips', async () => {
      const trip = buildTrip();
      const req = {
        query: { sortField: 'startLocation', sortOrder: 'asc' },
        filters: {},
        pagination: { page: 1, limit: 5 },
        originalUrl: '/api/trips?page=1',
      };
      const res = mockResponse();
      Trip.paginate.mockResolvedValue({
        docs: [trip],
        totalDocs: 1,
        totalPages: 1,
        page: 1,
        limit: 5,
      });
      generatePaginationLinks.mockReturnValue({
        linkHeader: '<links>',
        next: null,
        prev: null,
      });

      await tripController.getAllTrips(req, res);

      expect(Trip.paginate).toHaveBeenCalledWith({}, expect.objectContaining({
        page: 1,
        limit: 5,
        populate: expect.any(Array),
      }));
      expect(res.set).toHaveBeenCalledWith('Link', '<links>');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [trip] }));
    });
  });

  describe('getTripById', () => {
    it('rejects invalid ID format', async () => {
      const req = { params: { id: 'invalid' } };
      const res = mockResponse();

      await tripController.getTripById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 200 when trip found, 204 otherwise', async () => {
      const id = new Types.ObjectId().toHexString();
      const req = { params: { id } };
      const res = mockResponse();
      Trip.findById.mockResolvedValue(buildTrip({ _id: id }));

      await tripController.getTripById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      Trip.findById.mockResolvedValue(null);
      await tripController.getTripById(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe('createTrip', () => {
    it('rejects missing driver/vehicle', async () => {
      const req = { body: { startLocation: 'A' } };
      const res = mockResponse();

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('rejects duplicate trips', async () => {
      const payload = buildTrip();
      const req = { body: payload };
      const res = mockResponse();
      Trip.findOne.mockResolvedValue(payload);

      await tripController.createTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('creates trip when payload valid', async () => {
      const payload = buildTrip();
      const req = { body: payload };
      const res = mockResponse();
      Trip.findOne.mockResolvedValue(null);
      Trip.create.mockResolvedValue(payload);

      await tripController.createTrip(req, res);

      expect(Trip.create).toHaveBeenCalledWith(expect.objectContaining({
        driver: payload.driver,
        vehicle: payload.vehicle,
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(payload);
    });
  });

  describe('updateTrip', () => {
    it('requires driver and vehicle ids', async () => {
      const req = { params: { id: new Types.ObjectId().toHexString() }, body: { driver: '', vehicle: '' } };
      const res = mockResponse();

      await tripController.updateTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('updates trip when payload valid', async () => {
      const trip = buildTrip();
      const req = {
        params: { id: trip._id },
        body: {
          driver: trip.driver,
          vehicle: trip.vehicle,
          startLocation: 'Gold Coast',
          endLocation: 'Brisbane',
          startTime: trip.startTime,
          endTime: trip.endTime,
        },
      };
      const res = mockResponse();
      Trip.findByIdAndUpdate.mockResolvedValue({ ...trip, ...req.body });

      await tripController.updateTrip(req, res);

      expect(Trip.findByIdAndUpdate).toHaveBeenCalledWith(
        trip._id,
        expect.objectContaining({ startLocation: 'Gold Coast' }),
        expect.objectContaining({ new: true, runValidators: true }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteTrip', () => {
    it('returns 200 message when deleted, 204 otherwise', async () => {
      const trip = buildTrip();
      const req = { params: { id: trip._id } };
      const res = mockResponse();

      Trip.findByIdAndDelete.mockResolvedValue(trip);
      await tripController.deleteTrip(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      Trip.findByIdAndDelete.mockResolvedValue(null);
      await tripController.deleteTrip(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
