jest.mock('../../../src/models/vehicle', () => ({}));
jest.mock('../../../src/utils/generatePaginationLinks', () => ({
  generatePaginationLinks: jest.fn(),
}));

const Vehicle = require('../../../src/models/vehicle');
const { generatePaginationLinks } = require('../../../src/utils/generatePaginationLinks');
const vehicleController = require('../../../src/controllers/vehicleController');
const { buildVehicle } = require('../../fixtures/vehicles');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('vehicleController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Vehicle.paginate = jest.fn();
    Vehicle.findById = jest.fn();
    Vehicle.findOne = jest.fn();
    Vehicle.create = jest.fn();
    Vehicle.findByIdAndUpdate = jest.fn();
    Vehicle.findByIdAndDelete = jest.fn();
  });

  describe('getAllVehicles', () => {
    it('returns paginated vehicles and headers', async () => {
      const vehicle = buildVehicle();
      const req = {
        query: { sortField: 'make', sortOrder: 'asc' },
        filters: {},
        pagination: { page: 2, limit: 5 },
        originalUrl: '/api/vehicles?page=2',
      };
      const res = mockResponse();
      Vehicle.paginate.mockResolvedValue({
        docs: [vehicle],
        totalDocs: 4,
        totalPages: 2,
        page: 2,
        limit: 5,
      });
      generatePaginationLinks.mockReturnValue({
        linkHeader: '<links>',
        next: null,
        prev: '/api/vehicles?page=1',
      });

      await vehicleController.getAllVehicles(req, res);

      expect(Vehicle.paginate).toHaveBeenCalledWith({}, expect.objectContaining({
        page: 2,
        limit: 5,
        sort: { make: 1 },
      }));
      expect(res.set).toHaveBeenCalledWith('Link', '<links>');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [vehicle] }));
    });
  });

  describe('getVehicleById', () => {
    it('returns 200 when found and 204 otherwise', async () => {
      const vehicle = buildVehicle();
      const req = { params: { id: vehicle._id } };
      const res = mockResponse();
      Vehicle.findById.mockResolvedValue(vehicle);

      await vehicleController.getVehicleById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(vehicle);

      Vehicle.findById.mockResolvedValue(null);
      await vehicleController.getVehicleById(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe('createVehicle', () => {
    it('rejects duplicate plate numbers', async () => {
      const req = { body: { make: 'Toyota', model: 'Camry', plateNumber: 'PLT1' } };
      const res = mockResponse();
      Vehicle.findOne.mockResolvedValue(buildVehicle({ plateNumber: 'PLT1' }));

      await vehicleController.createVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('creates new vehicle', async () => {
      const req = { body: { make: 'Honda', model: 'Civic', plateNumber: 'NEW123' } };
      const res = mockResponse();
      const created = buildVehicle(req.body);
      Vehicle.findOne.mockResolvedValue(null);
      Vehicle.create.mockResolvedValue(created);

      await vehicleController.createVehicle(req, res);

      expect(Vehicle.create).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('updateVehicle', () => {
    it('rejects invalid driver ObjectId', async () => {
      const req = { params: { id: buildVehicle()._id }, body: { make: 'A', model: 'B', driver: 'bad' } };
      const res = mockResponse();

      await vehicleController.updateVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringMatching(/Driver ID format is invalid/i),
      }));
    });

    it('updates vehicle when payload valid', async () => {
      const vehicle = buildVehicle();
      const req = {
        params: { id: vehicle._id },
        body: { make: 'Tesla', model: 'Model 3', year: 2024, plateNumber: 'PLT999' },
      };
      const res = mockResponse();
      Vehicle.findByIdAndUpdate.mockResolvedValue({ ...vehicle, ...req.body });

      await vehicleController.updateVehicle(req, res);

      expect(Vehicle.findByIdAndUpdate).toHaveBeenCalledWith(
        vehicle._id,
        expect.objectContaining(req.body),
        expect.objectContaining({ new: true, runValidators: true }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteVehicle', () => {
    it('returns 200 with message when delete succeeds', async () => {
      const vehicle = buildVehicle();
      const req = { params: { id: vehicle._id } };
      const res = mockResponse();
      Vehicle.findByIdAndDelete.mockResolvedValue(vehicle);

      await vehicleController.deleteVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vehicle deleted' });
    });

    it('returns 204 when nothing deleted', async () => {
      const req = { params: { id: buildVehicle()._id } };
      const res = mockResponse();
      Vehicle.findByIdAndDelete.mockResolvedValue(null);

      await vehicleController.deleteVehicle(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
