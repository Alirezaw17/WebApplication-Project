import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import './App.css';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
};
//localStorage.getItem('token') — checks if a JWT token exists in the browser's storage.
//If it exists → they are logged in. If not → they are a stranger.

/* RoyaApp project uses a session-based auth pattern (cookie from server), 
while your task app uses JWT token in localStorage. Both are valid — this one just asks the
 server on every refresh instead of reading a local token. */

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
};

