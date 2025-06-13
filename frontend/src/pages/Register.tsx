import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/auth.schema";
import { z } from "zod";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

type RegisterInput = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await axios.post("/auth/register", data);
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-primary-800 mt-4">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2">
            Get started with your Pomodoro journey
          </p>
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
              placeholder="Choose a username"
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
              placeholder="Create a password"
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
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
