//USELESS FILE
// frontend/src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";

const Home = () => (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <h1>SmartSplit Commerce Platform</h1>
    <p>Public Landing Page — System Operational.</p>
  </div>
);

const Login = () => (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <h1>Account Authentication</h1>
    <p>Secure login terminal placeholder.</p>
  </div>
);

const Register = () => (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <h1>Register New Account</h1>
    <p>Account creation console placeholder.</p>
  </div>
);

const Dashboard = () => (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <h1>Admin Dashboard Terminal</h1>
    <p>Core platform control center layout panel placeholder.</p>
  </div>
);

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
]);