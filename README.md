# PineApp - User Authentication and Profile Management API

A RESTful API built with Elysia.js, Bun, and Prisma for user authentication and profile management.

## Features

- User Registration (Sign-Up)
- User Authentication (Sign-In)
- Password Reset with OTP Verification
- Profile Management (Retrieve and Update)
- JWT-based Authentication
- API Documentation with Swagger

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- SQLite (included)

## Setup

1. Clone the repository
2. Create a `.env` file based on `.env.example` and configure your environment variables
3. Install dependencies:
   ```bash
   bun install
   ```
4. Set up the database:
   ```bash
   bun run db:migrate
   ```
5. Generate Prisma client:
   ```bash
   bun run db:generate
   ```
6. Start the development server:
   ```bash
   bun run dev
   ```

## Development Commands

```bash
# Start development server with hot reload
bun run dev

# Run production server
bun run start

# Run tests
bun run test

# Build for production
bun run build

# Database commands
bun run db:migrate    # Run database migrations
bun run db:generate   # Generate Prisma client
bun run db:studio     # Open Prisma Studio for database management
```

## API Documentation

Once the server is running, visit `/swagger` to view the complete API documentation.

### API Endpoints

#### Authentication
[Documentation link](https://localhost:3000/swagger) 
- POST `/auth/register` - Register a new user
- POST `/auth/login` - User login
- POST `/auth/reset-password` - Request password reset
- POST `/auth/verify-otp` - Verify OTP and reset password

#### Profile Management
- GET `/profile` - Get user profile
- PUT `/profile` - Update user profile

## Security Features

- Password hashing using Bun's crypto functions
- JWT-based authentication
- OTP verification for password reset
- Secure session management

## Development

```bash
# Run in development mode with hot reload
bun dev

# Run in production mode
bun start
```