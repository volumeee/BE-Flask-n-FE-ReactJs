# Organization Management App

This project is an Organization Management App that allows users to manage members within an organization. It includes features like Google login, CRUD operations for member management, and a responsive frontend built with React.js. The backend is powered by Flask, and the app is designed to be scalable and easy to extend.

## Demo
https://github.com/user-attachments/assets/f47bc061-2e04-4a77-a6c4-9249f542aea1

## Features

- **Google Login**: Secure authentication with Google OAuth 2.0.
- **Member Management**:
  - Create, Read, Update, and Delete (CRUD) operations for managing members.
  - Upload member pictures.
  - Manage member skills (e.g., Leadership, Communication, Problem Solving).
- **Responsive Design**: The frontend is built with React.js and Material-UI for a clean and responsive user interface.
- **Backend**: The backend is implemented with Flask and MongoDB, providing a robust API for frontend interaction.

## Technologies Used

### Frontend

- **React.js**: JavaScript library for building user interfaces.
- **Material-UI**: A popular React UI framework for creating responsive layouts.
- **TypeScript**: Superset of JavaScript that adds static types.

### Backend

- **Flask**: A lightweight WSGI web application framework in Python.
- **MongoDB**: NoSQL database for storing member data.
- **Flask-CORS**: To handle Cross-Origin Resource Sharing (CORS) between the frontend and backend.
- **Google OAuth 2.0**: For secure login with Google.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB
- Google Cloud Console project for OAuth 2.0 credentials

### Authentication

- **POST** `/login`: Authenticate with Google OAuth 2.0.

### Members

- **GET** `/api/members`: Get a list of all members.
- **GET** `/api/members/:id`: Get details of a specific member.
- **POST** `/api/members`: Create a new member.
- **PUT** `/api/members/:id`: Update an existing member.
- **DELETE** `/api/members/:id`: Delete a member.
