# Commit-m Assessments

This project is a monorepo NestJS application implemented as microservices with PostgreSQL integration.
It consists of four services: api-gateway, auth, users, and books.

## Features

- Book Listing: Users should be able to list all books available in the library.
- Book Addition: Users should be able to add new books to the library.
- Book Update: Admin should be able to update existing book information.
- Book Deletion: Admin should be able to delete books from the library.
- User Management: Implement basic user management functionalities (e.g., registration, authentication).
- Book Borrowing and Returning: Add functionalities for users to borrow and return books.
- Book Search: Implement search functionality to allow users to search for books by title, author, or category.
- Book Availability: Show the availability status of each book (e.g. is available or not).
- User Profile: Provide endpoints for users to view and update their profile information.
- PostgreSQL database integration
- Docker containerization
- API documentation with Swagger

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- PostgreSQL (for local development without Docker)

## Running the Project With Docker

1. Clone the repository:

```bash
git clone https://github.com/thismajid/commit-m-library-assessment.git
```

2. Navigate to the project directory:

```bash
cd commit-m-library-assessment
```

3. Start project:

```bash
docker-compose up
```

4. Open this url on browser:

```bash
http://localhost:3000/api/docs
```

## Running the Project Without Docker

To run this project locally without using Docker, follow these steps:

1. Ensure you have Node.js and npm installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

2. Make sure you have MongoDB installed and running on your local machine. If not, you can download it from [mongodb.com](https://www.mongodb.com/try/download/community).

3. Clone the repository:

```bash
git clone https://github.com/thismajid/sepehrsaya-assessments
```

4. Navigate to the project directory:

```bash
cd sepehrsaya-assessments
```

5. Install the project dependencies:

```bash
npm install
```

6. Create a `.env` file in the root directory of the project. You can copy the `.env.example` file and modify it as needed:

```bash
cp .env.example .env
```

7. Open the `.env` file and update the `MONGODB_URL` to point to your local MongoDB instance:

```bash
MONGODB_URL=mongodb://localhost:27017/sepehrsaya
```

8. Start the server

```bash
npm start
```

9.  The server should now be running. By default, it will be available at:

```bash
http://localhost:3000/api/v1/docs
```

## API Endpoints

- POST /api/v1/auth/login - User login
- GET /api/v1/users - Get all users
- GET /api/v1/users/:id - Get a specific user
- PATCH /api/v1/users/:id - Update a user
- DELETE /api/v1/users/:id - Delete a user

For detailed API documentation, refer to the Swagger docs at `/api/v1/docs`.
