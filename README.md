# Assignment Management System - Frontend

A React frontend application for the Assignment Management System with role-based dashboards (Teacher/Student).

## 🚀 Features

### Teacher Dashboard
- View all assignments with status filtering (Draft/Published/Completed)
- Create new assignments (saved as Draft)
- Edit and delete assignments (Draft status only)
- Publish assignments (Draft → Published)
- Mark assignments as completed (Published → Completed)
- View all submissions for an assignment
- Dashboard analytics showing submission counts per assignment
- Pagination for assignment lists (10 items per page)

### Student Dashboard
- View all published assignments
- Submit answers to assignments (one submission per assignment)
- View submitted answers
- Automatic blocking after due date
- Visual indicators for submission status
- Pagination for assignment lists (10 items per page)

### Authentication
- JWT-based authentication
- Role-based routing
- Protected routes
- Automatic redirect based on user role

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (you can use `.env.example` as a template):

```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: Change the URL if your backend is running on a different port or host.

### 3. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173` (or another port if 5173 is taken).

### 4. Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## 🔐 Demo Credentials

### Teacher Account
- Email: `teacher@example.com`
- Password: `teacher123`

### Student Account
- Email: `student@example.com`
- Password: `student123`

## 📁 Project Structure

```
assignment-frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Route protection component
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── TeacherDashboard.jsx  # Teacher dashboard
│   │   └── StudentDashboard.jsx  # Student dashboard
│   ├── utils/
│   │   └── api.js                # Axios configuration
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles (TailwindCSS)
├── public/                       # Static assets
├── index.html                    # HTML template
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: TailwindCSS
- **State Management**: Context API

## 🎨 Features in Detail

### Teacher Workflow
1. Login with teacher credentials
2. Create assignments (default status: Draft)
3. Edit or delete Draft assignments
4. Publish assignments to make them visible to students
5. View student submissions
6. Mark assignments as completed

### Student Workflow
1. Login with student credentials
2. View all published assignments
3. Submit answers (once per assignment)
4. View previously submitted answers
5. Cannot submit after due date

## 🔒 Route Protection

- `/login` - Public route
- `/teacher` - Protected, requires teacher role
- `/student` - Protected, requires student role
- Automatic redirect based on user role after login

## 📝 Notes

- JWT token is stored in localStorage
- Token is automatically included in API requests
- User data is persisted in localStorage
- Protected routes automatically redirect to login if not authenticated
- Role-based access control enforced on frontend and backend

## 🐛 Troubleshooting

### CORS Errors
Make sure your backend CORS is configured to allow requests from the frontend URL.

### API Connection Issues
- Verify `VITE_API_URL` in `.env` matches your backend URL
- Ensure backend server is running
- Check browser console for detailed error messages

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
