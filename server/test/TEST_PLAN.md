# Test Plan

## 1. Objectives
- Verify `/api/drivers`, `/api/vehicles`, and `/api/trips` endpoints implement CRUD, validation, pagination, sorting, and duplicate detection as designed.
- Confirm middlewares (`validatePagination`, `validateObjectId`, `validate*Query`) and utilities (e.g., `generatePaginationLinks`) behave consistently across resources.
- Provide regression protection so that schema validation, reference integrity, and edge HTTP statuses (400/404/409/204) are caught in CI before deployment.

## 2. Scope
### In Scope
- Unit tests for controllers, middleware, and utility helpers with mocked Mongoose models.
- Integration tests against the Express app using `supertest` plus `mongodb-memory-server` for isolated persistence.
- Response-structure assertions (status codes, JSON shape, Link headers) plus pagination/filter combinations.

### Out of Scope
- Front-end/UI contract testing.
- Performance or security penetration testing beyond verifying Helmet/CORS are mounted.
- Authentication/authorization (API currently unauthenticated).

## 3. Environments & Tooling
- **Runtime:** Node.js ≥ 20.
- **Test runner:** Jest (`npm run test`, `npm run test:ci`).
- **HTTP assertions:** `supertest`.
- **Database:** `mongodb-memory-server` for integration suites; Jest globals close connections in `afterAll`.
- **Fixtures:** `test/fixtures` folder providing factories for drivers, vehicles, trips with valid ObjectIds and reference wiring.
- **Env config:** `.env.test` or inline `process.env.mongodb_URI` pointing to the in-memory URI during tests.

## 4. Test Types & Structure
```
test/
  fixtures/
    drivers.js
    vehicles.js
    trips.js
  unit/
    controllers/
      driverController.test.js
      vehicleController.test.js
      tripController.test.js
    middleware/
      validatePagination.test.js
      validateObjectId.test.js
      validateDriverQuery.test.js
      validateVehicleQuery.test.js
      validateTripQuery.test.js
    utils/
      generatePaginationLinks.test.js
  integration/
    drivers.test.js
    vehicles.test.js
    trips.test.js
    health.test.js
```

## 5. Key Scenarios
### Drivers
- Pagination with `Link` header and `totalPages` fields.
- Filtering by `firstName` and `licenceNumber`, sorting asc/desc.
- Duplicate `licenceNumber` returns 409; missing required fields yields 400.
- `GET /drivers/:id` invalid ObjectId (400) vs not found (204); successful delete returns 204.

### Vehicles
- Create with optional `year`; duplicate `plateNumber` → 409.
- Update rejects invalid `driver` ObjectId; missing `make/model` → 400.
- List filtering by `make`, `model`, `year` plus sorting; delete returns confirmation payload.

### Trips
- List populates driver/vehicle references; filters and sort combos.
- Create/update require valid driver & vehicle IDs; missing references → 400.
- Duplicate trip payload (same driver, vehicle, locations, times) → 409.
- `GET /trips/:id` invalid ObjectId → 400; delete success returns 200 JSON.

### Middleware & Utilities
- `validatePagination` supplies defaults (page=1, limit=5) and rejects non-numeric or out-of-range values.
- `validate*Query` strips unsupported params and surfaces descriptive errors.
- `generatePaginationLinks` preserves query params, omits `next/prev` on boundaries, constructs RFC5988-compliant header.

## 6. Data Management
- Before each integration suite: start fresh Mongo memory server, seed baseline fixtures (≥3 drivers, ≥3 vehicles, ≥2 trips).
- After each test: clear collections via `mongoose.connection.db.collection(...).deleteMany({})` to avoid cross-test pollution.
- Helpers provide factory methods for invalid ObjectIds, duplicates, and cross-resource references.

## 7. Regression & Reporting
- Configure Jest coverage thresholds (e.g., 80% statements/branches/functions/lines) and fail CI when unmet.
- `npm run test:ci` executes with `--ci` (and `--runInBand` if Mongo memory server shows race conditions).
- Optional `--json --outputFile` for CI artifacts.

## 8. Risks & Mitigations
- **Mongoose connection leaks:** use Jest global setup/teardown to connect once and close connections after suites.
- **Time zone variance for trip timestamps:** normalize inputs to UTC and compare via ISO strings.
- **Large pagination seeds causing slow tests:** limit integration inserts to the minimum needed; rely on unit tests to mock large `paginate` results.

## 9. Next Steps
1. Install `supertest`, `mongodb-memory-server`, and any fixture helpers.
2. Scaffold fixture utilities and Jest setup/teardown files.
3. Implement unit suites per controller/middleware/utility.
4. Build integration suites focusing on CRUD + edge cases.
5. Wire Jest scripts in `package.json` (already pointing to `jest`) and add CI workflow if required.
