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
http://localhost:3000/api/v1/docs
```

## Admin User Information

### Admin Account Setup:

By default, the application creates an admin user during the initial first setup.

### Default Admin Credentials:

Username: admin
Password: strongAdminPassword

## API Endpoints

For detailed API documentation, refer to the Swagger docs at `/api/v1/docs`.
