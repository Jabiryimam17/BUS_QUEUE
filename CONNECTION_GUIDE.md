# Frontend-Backend Connection Guide

This document explains how the frontend and backend are connected.

## API Configuration

### Backend
- **Port**: 3001
- **Base URL**: `http://localhost:3001/api`

### Frontend
- **Port**: 3000
- **API URL**: Set in `frontend/.env.local` or defaults to `http://localhost:3001/api`

## Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - Frontend sends FormData with user info and photos
   - Backend stores user with 'pending' status
   - Returns success message

2. **Login** (`POST /api/auth/login`)
   - Frontend sends email, password, and user_type
   - Backend validates and returns JWT token
   - Frontend stores token in localStorage

3. **Protected Routes**
   - Frontend includes token in `Authorization: Bearer <token>` header
   - Backend validates token via `auth_middleware.js`

## File Uploads

- **Registration**: Two files (face_photo, id_photo) sent as FormData
- **Storage**: Files saved in `backend/uploads/` directory
- **Access**: Files served at `http://localhost:3001/uploads/:filename`
- **Database**: Only filename stored, not full path

## API Endpoints Mapping

### Authentication
- `POST /api/auth/register` → `authAPI.register()`
- `POST /api/auth/login` → `authAPI.login()`
- `GET /api/auth/status` → `authAPI.getStatus()`

### Buses
- `GET /api/buses/upcoming` → `studentAPI.getUpcomingBuses()`
- `GET /api/buses` → `adminAPI.getBuses()`
- `POST /api/buses` → `adminAPI.announceBus()`

### Tickets
- `POST /api/tickets/book` → `studentAPI.bookTicket()`
- `GET /api/tickets/my-ticket` → `studentAPI.getMyTicket()`
- `GET /api/tickets/queue/:bus_id` → `adminAPI.getBusQueue()`

### Users
- `GET /api/users/pending` → `adminAPI.getPendingRegistrations()`
- `POST /api/users/:id/approve` → `adminAPI.approveRegistration()`
- `POST /api/users/:id/reject` → `adminAPI.rejectRegistration()`

## Data Transformation

The frontend API layer (`frontend/lib/api.js`) transforms backend snake_case to frontend camelCase:

- `scheduled_time` → `scheduledTime`
- `ticket_window_open` → `ticketWindowOpen`
- `face_photo_path` → `facePhoto`
- `university_id` → `universityId`

## Error Handling

- Backend returns: `{ success: false, message: "error message" }`
- Frontend catches errors and displays via `react-hot-toast`
- API client (`api_client.js`) handles HTTP errors automatically

## CORS Configuration

Backend allows all origins in development. Update `backend/server.js` for production:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Running the Application

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   # Setup MySQL database (see backend/README.md)
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## Environment Variables

### Backend (.env)
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=busqueue
JWT_SECRET=your-secret-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Testing the Connection

1. Register a new student at `/register`
2. Login at `/login`
3. Check dashboard for approval status
4. Admin can approve at `/admin/approvals`
5. Book tickets at `/book-ticket`
6. View queue at `/controller/:bus_id`
