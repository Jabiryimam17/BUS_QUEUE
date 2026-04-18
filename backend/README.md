# BusQueue Backend

Backend server for BusQueue application built with Node.js, Express, and PostgreSQL following MVC architecture.

## Project Structure

```
backend/
├── configs/          # Configuration files
│   ├── database.js   # PostgreSQL connection
│   ├── jwt.js        # JWT configuration
│   └── upload.js     # File upload configuration
├── controllers/      # Request handlers
│   ├── auth_controller.js
│   ├── bus_controller.js
│   ├── ticket_controller.js
│   └── user_controller.js
├── database/         # Database schema
│   └── schema.sql   # PostgreSQL schema
├── middleware/       # Custom middleware
│   ├── auth_middleware.js
│   └── error_middleware.js
├── models/          # Data models
│   ├── user_model.js
│   ├── bus_model.js
│   └── ticket_model.js
├── routers/         # Route definitions
│   ├── auth_router.js
│   ├── bus_router.js
│   ├── ticket_router.js
│   └── user_router.js
├── services/        # Business logic
│   ├── auth_service.js
│   ├── bus_service.js
│   ├── ticket_service.js
│   └── user_service.js
├── utils/           # Utility functions
│   ├── jwt.js
│   ├── password.js
│   └── response.js
├── uploads/          # Uploaded files (created automatically)
├── server.js        # Entry point
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create the PostgreSQL database (example):
```sql
CREATE DATABASE busqueue;
```

2. Run the schema file (psql):
```bash
psql -U postgres -d busqueue -f database/schema.sql
```

Or import the `database/schema.sql` file using your PostgreSQL client.

### 3. Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=busqueue
DB_PORT=5432

JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# JWT Keys (Optional - if not using RSA keys)
# JWT_SECRET=your-super-secret-jwt-key-change-in-production
# JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

### 4. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/status` - Get user status (protected)

### Buses

- `GET /api/buses/upcoming` - Get upcoming buses (public)
- `GET /api/buses` - Get all buses (admin)
- `GET /api/buses/:bus_id` - Get bus by ID
- `POST /api/buses` - Create bus (admin)
- `PUT /api/buses/:bus_id` - Update bus (admin)
- `DELETE /api/buses/:bus_id` - Delete bus (admin)

### Tickets

- `POST /api/tickets/book` - Book ticket (student)
- `GET /api/tickets/my-ticket` - Get my ticket (student)
- `GET /api/tickets/queue/:bus_id` - Get bus queue (admin)
- `DELETE /api/tickets/:ticket_id` - Cancel ticket (student)

### Users

- `GET /api/users/pending` - Get pending registrations (admin)
- `POST /api/users/:registration_id/approve` - Approve registration (admin)
- `POST /api/users/:registration_id/reject` - Reject registration (admin)
- `GET /api/users/:user_id` - Get user by ID (admin)

## JWT Authentication

The system uses RSA public/private key pairs for JWT token signing (RS256 algorithm).

### Setup RSA Keys

1. Place your RSA keys in `configs/keys/` folder:
   - `private.pem` - Private key for signing tokens
   - `public.pem` - Public key for verifying tokens

2. Generate keys using OpenSSL:
   ```bash
   openssl genrsa -out configs/keys/private.pem 2048
   openssl rsa -in configs/keys/private.pem -pubout -out configs/keys/public.pem
   ```

3. **Fallback**: If RSA keys are not found, the system will automatically fall back to using the `JWT_SECRET` environment variable with HS256 algorithm.

### Using JWT Tokens

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## File Uploads

Registration requires two image uploads:
- `face_photo` - Student face photo
- `id_photo` - University ID photo

Files are stored in the `uploads/` directory and served at `/uploads/:filename`.

## Coding Conventions

- **Snake case** for all variables and functions
- **MVC architecture** - Models, Views (Controllers), Services
- **Error handling** - Centralized error middleware
- **Response format** - Consistent JSON responses
- **JWT authentication** - Token-based auth (no sessions)

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (`pg`)
- JWT (jsonwebtoken) - RSA keys (RS256) or secret (HS256)
- bcryptjs (password hashing)
- Multer (file uploads)
- express-validator (request validation)
