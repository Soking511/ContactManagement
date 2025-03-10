# Contact Management API

## Introduction

The Contact Management API is a robust RESTful service built with Express.js and TypeScript, featuring real-time capabilities through Socket.IO and secure data persistence using MongoDB.

## Features

- **Authentication System**: Secure JWT-based authentication.
- **Real-time Features**: Contact management with Socket.IO events.
- **Lock Management**: Prevents concurrent modifications.
- **Data Validation**: Ensures data integrity with predefined rules.
- **Pagination Support**: Optimized data retrieval.
- **Security Measures**: Implements industry best practices.
- **Error Handling**: Consistent API responses with meaningful status codes.

## System Architecture

- **Express.js Server**
- **Socket.IO Real-time Server**
- **MongoDB Database**
- **JWT Authentication**
- **TypeScript Type System**

## Authentication System

- JWT Implementation:
  - Token Duration: 30 days
  - Payload: User ID, Username
  - Security Features:
    - Password Hashing (bcrypt, Salt Rounds: 10)
    - Environment-based Secret Key

## Lock Management System

- Periodic Cleanup:
  - Automatic cleanup every 5 minutes.
- Lock Cleanup Components:
  - Periodic Timer
  - Lock Validation
  - Automatic Removal
- Lock Cleanup Strategy:
  - Real-time Cleanup
  - Disconnection Cleanup
  - Background Cleanup
- Session Timeout Handling:
  - Unlock contact
  - Visual timeout
  - Automatic page refresh

## Data Models

### Contact Model

```typescript
interface IContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
}
```

### User Model

```typescript
interface IUser {
  id: string;
  username: string;
  password: string;
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Authenticate and obtain a JWT token.

### Contact Endpoints

- `GET /api/contacts`: Retrieve contacts (with pagination and search).
- `POST /api/contacts`: Create a new contact.
- `PUT /api/contacts/:contactId`: Update a contact (lock mechanism included).
- `DELETE /api/contacts/:contactId`: Delete a contact.

## Real-time Features

- **Socket Events**:
  - `contact:updated`
  - `contact:deleted`
  - `contact:created`
  - `contact:locked`
  - `contact:unlocked`
  - `contact:lockState`
- **Contact Locking System**:
  - Lock Duration: 5 minutes
  - Auto-release on Timeout, User Disconnect, or Manual Release

## Validation System

- **Contact Validation Rules**:
  - Name: 2-40 characters
  - Email: Valid format
  - Phone: Valid Egyptian format
  - Notes: Optional (2-40 characters)

## Pagination System

- Default Page Size: 5
- Searchable Fields: `name`, `email`, `phone`, `address` (city, country, street)

## Security Measures

- JWT Authentication
- Password Hashing
- Input Validation
- CORS Protection
- Type Safety

## Error Handling

- **HTTP Status Codes**:
  - `200`: Success
  - `201`: Created
  - `400`: Bad Request
  - `401`: Unauthorized
  - `404`: Not Found

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Environment Variables

Create a `.env` file and define:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

## License

This project is licensed under the MIT License.

