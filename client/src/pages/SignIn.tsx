import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { FiEye, FiEyeOff } from "react-icons/fi";
import * as apiClient from "../api-clients";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useAppContext();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue, // Added for setting form values
  } = useForm<SignInFormData>();
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation(apiClient.SignIn, {
    onSuccess: async () => {
      showToast({ message: "Login successfully!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const handleTestLogin = () => {
    // Set predefined email and password values
    setValue("email", "founders@gmail.com");
    setValue("password", "1234567890");
    // Trigger form submission
    onSubmit();
  };

  return (
    <form
      className="flex flex-col gap-5 p-5 md:p-0"
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <h2 className="text-3xl font-black">Sign In</h2>
      <label className="text-gray-700 text-lg font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal focus:outline-none focus:border-blue-500"
          {...register("email", {
            required: "This field is required",
          })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-lg font-bold flex-1">
        Password
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal focus:outline-none focus:border-blue-500"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>

      <span className="flex items-center justify-between">
        <span className="text-sm">
          Not Registered?{" "}
          <Link to="/register" className="underline">
            Create an account here
          </Link>
        </span>
        <div>
          {/* Test login button */}
          <button
            type="button"
            className="bg-orange-600 text-white p-2 mr-5 font-bold hover:bg-orange-500 text-xl rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleTestLogin}
          >
            Test Login
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Log in
          </button>
        </div>
      </span>
    </form>
  );
};

export default SignIn;
