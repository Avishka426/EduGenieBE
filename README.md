# Backend Authentication and User Management

This backend project provides a simple authentication and user management system built with TypeScript and Express. It includes functionalities for user registration, login, and user profile management.

## Project Structure

- **src/app.ts**: Entry point of the application, initializes the Express app and sets up middleware and routes.
- **src/controllers/authController.ts**: Contains the `AuthController` class with methods for user registration and login.
- **src/controllers/userController.ts**: Contains the `UserController` class with methods for retrieving and updating user information.
- **src/routes/authRoutes.ts**: Sets up authentication routes and links them to the `AuthController`.
- **src/routes/userRoutes.ts**: Sets up user-related routes and links them to the `UserController`.
- **src/middleware/authMiddleware.ts**: Middleware for checking user authentication.
- **src/models/userModel.ts**: Defines the user data structure and methods for database interaction.
- **src/types/index.ts**: Contains TypeScript interfaces for user data and authentication credentials.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the backend server, run:
```
npm start
```

The server will be running on `http://localhost:3000` by default.

## API Endpoints

- **Authentication**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.

- **User Management**
  - `GET /api/user`: Retrieve user information (requires authentication).
  - `PUT /api/user`: Update user information (requires authentication).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.