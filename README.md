# Assignment Portal - Frontend

React app for managing assignments. Teachers can create assignments and review submissions, students can view and submit assignments.

## Setup

Make sure you have Node.js installed (v14 or higher).

Install dependencies:
```
npm install
```

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Build

To build for production:
```
npm run build
```

Output goes to the `dist` folder.

## Project Structure

```
src/
  components/     - ProtectedRoute component
  context/        - AuthContext for user state
  pages/          - Home, Login, TeacherDashboard, StudentDashboard
  utils/          - API configuration
```

## Tech Used

- React
- Vite
- React Router
- Axios
- TailwindCSS

## Login

Use these credentials to test:

Teacher: teacher@example.com / teacher123
Student: student@example.com / student123

## Notes

- JWT token stored in localStorage
- Protected routes check user role
- API calls include auth token automatically
