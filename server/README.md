# Transport Manager API (Express APP)

Written by Ni Yan for Queensland University of Technology, IFN666 Web and Mobile Application Development.


## 1.The purpose of the application.
This **Transport Manager API** is a backend service built using **Express.js**， **Node.js**, **MongoDB/Mongoose** and **Caddy** that enables transport company admin to manage drivers, vehicles and trips easily. It has creating, updating, deleting and retrieving tasks. This API provides a secure backend to handle all operations for drivers, vehicles and trips management.
   


## 2.A list of API endpoints.
### - Drivers
- `GET /api/drivers` (Get all drivers, admins can see all drivers)
- `GET /api/drivers/:id` (Get a specific driver by MongoDB_id)
- `POST /api/drivers` (Create a new driver)
- `PUT /api/drivers/:id` (Update a driver by MongoDB_id)
- `DELETE /api/drivers/:id` (Delete a driver by MongoDB_id)


### - Vehicles
- `GET /api/vehicles` (Get all vehicles, admins can see all vehicles)
- `GET /api/vehicles/:id` (Get vehicle by MongoDB_id)
- `POST /api/vehicles` (Create a new vehicle)
- `PUT /api/vehicles/:id` (Update a vehicle by MongoDB_id)
- `DELETE /api/vehicles/:id` (Delete a vehicle by MongoDB_id)

### - Trips
- `GET /api/trips` (Get all trips, admins can see all drivers)
- `GET /api/trips/:id` (Get trip by MongoDB_id)
- `POST /api/trips` (Create a new trip)
- `PUT /api/trips/:id` (Update a trip by MongoDB_id)
- `DELETE /api/trips/:id` (Delete a trip by MongoDB_id)


## 3.A description of how to contribute to the development of the application.

I you want to contribute to this project and make it better, your help is very welcome. Here is the project contribution instructions. 

1. **Fork** the repository and clone it to your local machine.
2. **Create a new branch** for your feature or bug fix.
3. Make your changes and **commit** them with clear, descriptive commit messages. Make sure that you follow the existing code style and structure.
4. **Push** your changes to your forked repository.
5. Submit a **Pull Request (PR)** to the main repository.

Please ensure that your contributions follow the existing code style, include appropriate tests, and are well-documented.



## 4.A list of features
- **Driver, vehicle and trip management**: Supports CRUD oerations(Create, Read, UPdate, Delete) for the 3 entities.
- **Query filtering**:  Advanced query filtering and sorting on the get all routes. 
- **Pagination**: All list endpoints support page and limit parameters and next/prev links.
- **Custom middleware**: Ensure any incoming MongoDB id are valid, validates the pagination parameters are positive integers, sanitize and validate query parameters to each resource. 
- **Input validation**: validates ID formats, detects duplicate entries and ensures required fields are present. 
- **Security**: Using helmet to protect against web lulnerabilities. 


## 5.A list of dependencies and how to install them
- **express**: web framework for handling routing, middleware, and HTTP requests.
- **Mongoose**: MongoDB Object Data Modeling (ODM) library used to interact with the database.
- **mongoose-paginate-v2**:A plugin that adds built-in pagination capabilities to Mongoose models, simplifying paginated query responses.
- **express-async-handler**: Simplifies error handling in asynchronous Express route handlers by eliminating repetitive try/catch blocks.
- **express-validator**:  Middleware for validating and sanitizing request inputs, helping to ensure data integrity and prevent invalid input.
- **helmet**: Provides a collection of middleware functions to set secure HTTP headers, helping protect against common vulnerabilities.
- **cors**: Enables Cross-Origin Resource Sharing, allowing the API to accept requests from different domains.
- **jsonwebtoken**: Provides methods for encoding and decoding JWT tokens, commonly used for secure token-based authentication. I didn't implement this feature, but I still installed it for future extensibility.

To install these dependencies, you can simply run `npm install` in the root directory of the project.


## 6.A description of the applications architecture
The **Transport Management API** follows a clean RESTful architecture designed with following structure:
- **Express.js** is used to handle routing, request/response handling, and middleware processing.
- **MongoDB** is the primary database, accessed via **Mongoose**, which provides schema-based modeling and built-in validation.
- The application supports **pagination, filtering, and sorting** across all entities, using **mongoose-paginate-v2** for efficient server-side data slicing.
- **Security** is enhanced using Helmet, which sets various HTTP headers to protect against common vulnerabilities.
- A set of **custom middleware** modules are implemented to validate IDs, query parameters, and pagination inputs, improving input reliability and error reporting.
- The codebase is modularized into **controllers** (business logic), **models** (database schemas), **routes** (REST endpoints), **middleware** (validation logic), and **utils** (helper functions like pagination links), following the Model–Controller pattern.

### Folder Structure:

```
server/
├── src/
│   ├── controllers/
│   │   ├── driverController.js
│   │   ├── tripController.js
│   │   └── vehicleController.js
│   ├── middleware/
│   │   ├── validateDriverQuery.js
│   │   ├── validateObjectId.js
│   │   ├── validatePagination.js
│   │   ├── validateTripQuery.js
│   │   └── validateVehicleQuery.js
│   ├── models/
│   │   ├── driver.js
│   │   ├── trip.js
│   │   └── vehicle.js
│   ├── routes/
│   │   ├── driverRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── index.js
│   └── utils/
│       └── generatePaginationLinks.js
├── server.js          # Entry point: sets up Express app, middleware, routes
├── package.json       # Project metadata and dependencies
├── Caddyfile          # Production reverse proxy configuration
└── README.md          # Project documentation
```

## 7.How to report issues

If you encounter a bug, unexpected behavior, or have a suggestion for improvement, please follow these steps to report it:
1. **Check existing issues** before submitting a new issue to avoid duplicates.
2. **Create a new issue** if it hasn't been reported before. Here are the steps:
  - **Describe** the issue 
  - Steps to **reproduce** the issue
  - What you **expected to happen** and **actually happen**
  - Relavant **error messages** or **screenshots**
3. We will review your issue and let you know as soon as possible. 
