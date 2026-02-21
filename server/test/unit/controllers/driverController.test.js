jest.mock('../../../src/models/driver', () => ({}));
jest.mock('../../../src/utils/generatePaginationLinks', () => ({
  generatePaginationLinks: jest.fn(),
}));

const Driver = require('../../../src/models/driver');
const { generatePaginationLinks } = require('../../../src/utils/generatePaginationLinks');
const driverController = require('../../../src/controllers/driverController');
const { buildDriver } = require('../../fixtures/drivers');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('driverController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Driver.paginate = jest.fn();
    Driver.findById = jest.fn();
    Driver.findOne = jest.fn();
    Driver.create = jest.fn();
    Driver.findByIdAndUpdate = jest.fn();
    Driver.findByIdAndDelete = jest.fn();
  });

  describe('getAllDrivers', () => {
    it('returns paginated driver list with pagination headers', async () => {
      const driver = buildDriver();
      const req = {
        query: { sortField: 'firstName', sortOrder: 'desc' },
        filters: {},
        pagination: { page: 1, limit: 5 },
        originalUrl: '/api/drivers?page=1',
      };
      const res = mockResponse();
      Driver.paginate.mockResolvedValue({
        docs: [driver],
        totalDocs: 1,
        totalPages: 1,
        page: 1,
        limit: 5,
      });
      generatePaginationLinks.mockReturnValue({
        linkHeader: '<...>',
        next: null,
        prev: null,
      });

      await driverController.getAllDrivers(req, res);

      expect(Driver.paginate).toHaveBeenCalledWith({}, expect.objectContaining({
        page: 1,
        limit: 5,
        sort: { firstName: -1 },
      }));
      expect(res.set).toHaveBeenCalledWith('Link', '<...>');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: [driver],
        total: 1,
      }));
    });
  });

  describe('getDriverById', () => {
    it('returns 200 when driver exists', async () => {
      const driver = buildDriver();
      const req = { params: { id: driver._id } };
      const res = mockResponse();
      Driver.findById.mockResolvedValue(driver);

      await driverController.getDriverById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(driver);
    });

    it('returns 204 when driver missing', async () => {
      const req = { params: { id: buildDriver()._id } };
      const res = mockResponse();
      Driver.findById.mockResolvedValue(null);

      await driverController.getDriverById(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe('createDriver', () => {
    it('rejects duplicate licence numbers', async () => {
      const req = { body: { firstName: 'A', lastName: 'B', licenceNumber: 'LIC123' } };
      const res = mockResponse();
      Driver.findOne.mockResolvedValue(buildDriver({ licenceNumber: 'LIC123' }));

      await driverController.createDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringMatching(/already exists/i),
      }));
    });

    it('creates driver when payload unique', async () => {
      const req = { body: { firstName: 'A', lastName: 'B', licenceNumber: 'LIC999' } };
      const res = mockResponse();
      const created = buildDriver(req.body);
      Driver.findOne.mockResolvedValue(null);
      Driver.create.mockResolvedValue(created);

      await driverController.createDriver(req, res);

      expect(Driver.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('updateDriver', () => {
    it('returns updated driver', async () => {
      const driver = buildDriver({ firstName: 'Old' });
      const req = {
        params: { id: driver._id },
        body: { firstName: 'New', lastName: 'Doe' },
      };
      const res = mockResponse();
      const updated = { ...driver, firstName: 'New' };
      Driver.findByIdAndUpdate.mockResolvedValue(updated);

      await driverController.updateDriver(req, res);

      expect(Driver.findByIdAndUpdate).toHaveBeenCalledWith(
        driver._id,
        { firstName: 'New', lastName: 'Doe' },
        expect.objectContaining({ new: true, runValidators: true }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });

  describe('deleteDriver', () => {
    it('returns 400 when ObjectId invalid', async () => {
      const req = { params: { id: 'bad-id' } };
      const res = mockResponse();

      await driverController.deleteDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringMatching(/Invalid driver ID/),
      }));
    });

    it('returns 204 when deletion succeeds', async () => {
      const driver = buildDriver();
      const req = { params: { id: driver._id } };
      const res = mockResponse();
      Driver.findByIdAndDelete.mockResolvedValue(driver);

      await driverController.deleteDriver(req, res);

      expect(Driver.findByIdAndDelete).toHaveBeenCalledWith(driver._id);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it('returns 404 when driver not found', async () => {
      const driver = buildDriver();
      const req = { params: { id: driver._id } };
      const res = mockResponse();
      Driver.findByIdAndDelete.mockResolvedValue(null);

      await driverController.deleteDriver(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Driver not found.' });
    });
  });
});
