# SeedShare Garden Management System

## Project Overview

SeedShare Garden is a REST API-based garden management system developed using Node.js and Express.js.

The system is designed to manage gardeners, garden plots, and plot leases through API endpoints.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- SQLite (planned database integration)

## Project Structure

```text
SeedShare-Garden/
│
├── routes/
│   ├── gardeners.js
│   ├── plots.js
│   └── leases.js
│
├── server.js
├── package.json
├── package-lock.json
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | API status |
| GET | /gardeners | Get all gardeners |
| GET | /gardeners/:id | Get gardener by ID |
| POST | /gardeners | Create gardener |
| PUT | /gardeners/:id | Update gardener |
| DELETE | /gardeners/:id | Delete gardener |
| GET | /plots | Get all plots |
| GET | /plots/search | Search plots |
| GET | /plots/:id | Get plot by ID |
| POST | /plots | Create plot |
| PUT | /plots/:id | Update plot |
| DELETE | /plots/:id | Delete plot |
| GET | /leases | Get all leases |
| GET | /leases/:id | Get lease by ID |
| POST | /leases | Create lease |
| PUT | /leases/:id | Update lease |
| DELETE | /leases/:id | Delete lease |

## Current Development Status

- Express server setup completed.
- Route files created for gardeners, plots, and leases.
- Route syntax checks completed.
- Database integration and actual CRUD operations are pending.

## How to Run

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Complete the database integration, including `db/database.js`.
4. Start the server:

```bash
node server.js
```

## Team Contributions

The project is being developed collaboratively.

- Server setup and route structure: Pavani Kadivella
- Database implementation: To be completed by the assigned team members.

