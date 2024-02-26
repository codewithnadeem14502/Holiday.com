import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"; // Importing React Icons for eye icons
import * as apiClient from "../api-clients";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

// type of data going to store in form
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  // from react-hook-form aka useForm component
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // state management is done here
  const mutation = useMutation(apiClient.register, {
    // base on the success or error we are going to send the message according
    // on success
    onSuccess: async () => {
      showToast({ message: "Registration Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    // updating the state using mutation
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5 p-5 md:p-0" onSubmit={onSubmit}>
      <h1 className="text-3xl font-bold">Create an Account</h1>
      <div className="flex flex-col md:flex-row gap-5">
        {/* First Name */}
        <label className="text-gray-700 text-lg font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", {
              required: "This field is required",
            })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        {/* Last Name */}
        <label className="text-gray-700 text-lg font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", {
              required: "This field is required",
            })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      {/* Email */}
      <label className="text-gray-700 text-lg font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", {
            required: "This field is required",
          })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      {/* Password */}
      <label className="text-gray-700 text-lg font-bold flex-1">
        Password
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {/* Toggle password visibility button */}
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
          </span>
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      {/* Confirm Password */}
      <label className="text-gray-700 text-lg font-bold flex-1">
        Confirm Password
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("confirmPassword", {
              validate: (value) => {
                if (!value) {
                  return "This field is required";
                } else if (watch("password") !== value) {
                  return "Your passwords do not match";
                }
              },
            })}
          />
          {/* Toggle confirm password visibility button */}
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
          </span>
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      {/* Submit Button */}
      <span>
        <button
          type="submit"
          className="bg-blue-600 rounded-lg text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
