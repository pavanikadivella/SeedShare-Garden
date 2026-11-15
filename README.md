# 🌱 SeedShare Garden Management System

## 1. Project Overview

SeedShare Garden is a REST API-based Garden Management System developed using Node.js, Express.js, and SQLite.

The main objective of this project is to manage gardeners, garden plots, and plot leases through REST API endpoints.

The system allows users to:
- View all registered gardeners.
- Add new gardeners.
- View individual gardener details.
- View available garden plots.
- Add, update, and delete garden plots.
- Search garden plots by name or soil type.
- Filter plots based on soil type.
- Manage garden plot leases.
- Validate user input and handle errors.
## 2. Group Members
1. K. PAVANI (252U1R9051) — Server and Routes
2. J. YESHWANTH (252U1R9046) — Database (3 tables & queries)
3. A. HIMAJA (252U1R9008) — REST Endpoints (CRUD & Join)
4. D. RANJITH KUMAR (252U1R9032) — Validation and Search
5. D. ABHIRAM (252U1R9031) — Twist Rule (Smart Search)
6. R. YOGESHWARI (252U1R9011) — Postman Collection and README

## 3. Technologies Used

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Framework for building REST APIs.
- **JavaScript** – Programming language.
- **SQLite** – Database for storing application data.
- **npm** – Package manager.
- **Git and GitHub** – Version control and project management.

## 4. Project Folder Structure

```text
SeedShare-Garden/
│
├── db/
│   └── database.js
│
├── middleware/
│   └── validate.js
│
├── routes/
│   ├── gardeners.js
│   ├── plots.js
│   └── leases.js
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 5. Database Design

The project uses SQLite with three main tables.

### Gardeners Table

Stores information about registered gardeners.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Gardener name |
| email | TEXT | Unique email address |

### Plots Table

Stores information about garden plots.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Plot name |
| soil | TEXT | Soil type |

### Leases Table

Stores information about gardeners renting garden plots.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| gardener_id | INTEGER | References gardeners table |
| plot_id | INTEGER | References plots table |
| start_date | TEXT | Lease starting date |

Foreign key relationships are used to connect gardeners, plots, and leases.

The database is initialized automatically when the server starts. Sample records are inserted when the plots table is empty.

## 6. API Endpoints

### A. General API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |

### B. Gardeners API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/gardeners` | Get all gardeners |
| GET | `/gardeners/:id` | Get gardener by ID |
| POST | `/gardeners` | Add a new gardener |

### C. Plots API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/plots` | Get all garden plots |
| GET | `/plots/:id` | Get plot by ID |
| GET | `/plots?soil=loamy` | Filter plots by soil type |
| GET | `/plots?q=plot` | Search plots by name or soil |
| POST | `/plots` | Add a new plot |
| PUT | `/plots/:id` | Update plot details |
| DELETE | `/plots/:id` | Delete a plot |

### D. Leases API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/leases` | Get all leases with gardener and plot details |
| POST | `/leases` | Create a new lease |

## 7. Search and Filtering

The plots API supports searching and filtering using query parameters.

**Search plots:**

```http
GET /plots?q=plot
```

Searches plot names and soil types without considering uppercase or lowercase letters.

**Filter by soil type:**

```http
GET /plots?soil=loamy
```

Returns plots that match the specified soil type.

## 8. Sample API Requests

### Add a Gardener

**POST** `/gardeners`

```json
{
  "name": "Anjali",
  "email": "anjali@example.com"
}
```

### Add a Garden Plot

**POST** `/plots`

```json
{
  "name": "Rose Garden",
  "soil": "Loamy"
}
```

### Create a Lease

**POST** `/leases`

```json
{
  "gardener_id": 1,
  "plot_id": 3
}
```

### Update a Garden Plot

**PUT** `/plots/1`

```json
{
  "name": "Updated Garden A1",
  "soil": "Clay"
}
```

## 9. Validation and Error Handling

The project uses validation middleware to check incoming data.

Validation includes:

- Gardener name must not be empty.
- Gardener email must contain an `@` symbol.
- Plot name must not be empty.
- Soil type must not be empty.
- IDs must be positive integers.
- Gardener and plot IDs must exist before creating a lease.
- A plot cannot be leased more than once.

### HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid input |
| 404 | Resource not found |
| 409 | Conflict, such as duplicate email or an already leased plot |
| 500 | Internal server error |

## 10. How to Run the Project

**Step 1: Clone the repository**


git clone YOUR_GITHUB_REPOSITORY_URL


**Step 2: Open the project folder**

cd SeedShare-Garden
```

**Step 3: Install dependencies**

npm install

**Step 4: Start the server**

```bash
npm start
```

**Step 5: Open the API**

```text
http://localhost:3000/
```

The server will start on port 3000 by default.

## 11. Testing

The REST API endpoints can be tested using:

- Postman
- Thunder Client
- Browser (for GET requests)

Test the GET, POST, PUT, and DELETE operations supported by the project.
## Live Deployment

The SeedShare Garden Management System is deployed using Render.

**Live API URL:** https://seedshare-garden.onrender.com

**Available API Endpoints:**
- `/gardeners` – Manage gardeners
- `/plots` – Manage garden plots
- `/leases` – Manage plot leases

**Deployment Platform:** Render

**Repository:** https://github.com/pavanikadivella/SeedShare-Garden

## 12. Team Information

**Project Name:** SeedShare Garden Management System

**Group ID:** JP-GAI2A-G02

**Course:** Backend Development Fundamentals

**Project Type:** Group Assignment

## 13. Conclusion

SeedShare Garden Management System demonstrates the practical implementation of REST APIs using Node.js, Express.js, and SQLite.

The project provides operations for managing gardeners, garden plots, and leases. It also implements database relationships, input validation, search functionality, filtering, and error handling.

This project helps demonstrate important backend development concepts, including CRUD operations, REST API design, SQL queries, middleware, and database management.
