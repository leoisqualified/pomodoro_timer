// router.ts
import { createBrowserRouter } from "react-router-dom";
import App from "./App"; // App layout
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Has <Navbar /> and <Outlet />
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
