import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/auth.schema";
import { z } from "zod";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type LoginInput = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await axios.post("/auth/login", data);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
          <h2 className="text-3xl font-bold text-primary-800 mt-4">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              {...register("username")}
              placeholder="Enter your username"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.username ? "border-accent-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-accent-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-accent-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition-all`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-accent-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
