# Debt Collection Orchestration Engine (DCOE) Backend

## Overview
This is a simplified backend for the Debt Collection Orchestration Engine (DCOE) built using Node.js and Express. It uses MongoDB for data storage and JWT for authentication.

## Features
- JWT-based authentication with roles: Admin, Team Lead, Agent
- Case management with upload (JSON/CSV), assignment, status updates, and audit logs
- Analytics summary endpoint
- Sensitive data encryption (borrower name)
- Swagger API documentation
- Modular architecture
- Jest tests for key routes

## Setup

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or accessible remotely

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root with:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/dcoe
JWT_SECRET=supersecret
ENCRYPTION_KEY=your_encryption_key_here
JWT_TEST_TOKEN=your_test_jwt_token_here
```

### Running the Server
```bash
npx nodemon src/server.js
```

### Swagger API Docs
Visit: http://localhost:3000/api-docs

## API Endpoints

### Authentication
- POST `/auth/login` - Login and get JWT token

### Cases
- POST `/cases/upload` - Upload cases (Admin, Team Lead)
- GET `/cases?assigned_to=agent_id` - Get cases assigned to an agent
- PATCH `/cases/:id/update-status` - Update case status (Admin, Team Lead)

### Analytics
- GET `/analytics/summary` - Get analytics summary (Admin, Team Lead)

## Role-based Access
- Admin: Full access
- Team Lead: Manage cases and view analytics
- Agent: View assigned cases only

## Testing
Run tests with:
```bash
npm run test
```

## Future Improvements
- Add Redis or PostgreSQL for caching and complex queries
- Implement case assignment engine with real-time updates
- Add Docker support
- Enhance security and input validation