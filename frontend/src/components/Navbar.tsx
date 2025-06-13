import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-teal-700 text-teal-50 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-bold text-xl">PomoFocus</span>
        </div>
        <div className="flex gap-6">
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-600 transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/login"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-600 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-600 transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;