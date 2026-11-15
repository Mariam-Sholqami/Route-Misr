import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../api/api";
import { registerationSchema } from "../../schema/authschema";
import { RegisterationDefaultValues } from "../../defaultValues/AuthDefaultValues";
import type { IRegisterObject } from "../../interfaces/auth.interface";

// same Tailwind classes for every input
const inputClass =
  "w-full rounded-xl bg-gray-100 px-5 py-4 outline-none transition focus:ring-2 focus:ring-blue-500";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterObject>({
    defaultValues: RegisterationDefaultValues,
    resolver: zodResolver(registerationSchema),
  });

  // handleSubmit calls this function only if ALL validation passed
  async function callRegisterAPI(values: IRegisterObject) {
    setLoading(true);
    setEmailExists(false);

    try {
      await axios.post(`${baseURL}/users/signup`, values);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // 409 Conflict => this user already exists
        // exists email or username.....
        if (status === 409) {
          setEmailExists(true); 
        }

        if (message) {
          toast.error(message);
        } else {
          toast.error("Registration failed, please try again");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-blue-600">
          Register
        </h1>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <form className="space-y-5" onSubmit={handleSubmit(callRegisterAPI)}>
            {/* name */}
            <div>
              <input
                type="text"
                autoComplete="name"
                placeholder="Enter Your Name"
                className={inputClass}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-400 my-2">{errors.name.message}</p>
              )}
            </div>

            {/* username */}
            <div>
              <input
                type="text"
                autoComplete="username"
                placeholder="Enter Your User Name"
                className={inputClass}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-400 my-2">{errors.username.message}</p>
              )}
            </div>

            {/* email */}
            <div>
              <input
                type="email"
                autoComplete="email"
                placeholder="Enter Your Email"
                className={inputClass}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 my-2">{errors.email.message}</p>
              )}
            </div>

            {/* password */}
            <div>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Enter Your Password"
                className={inputClass}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-400 my-2">{errors.password.message}</p>
              )}
            </div>

            {/* rePassword */}
            <div>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter Your Password"
                className={inputClass}
                {...register("rePassword")}
              />
              {errors.rePassword && (
                <p className="text-red-400 my-2">{errors.rePassword.message}</p>
              )}
            </div>

            {/* dateOfBirth */}
            <div>
              <input
                type="date"
                className={inputClass + " text-gray-500"}
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-red-400 my-2">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* gender=> both radios use register("gender") */}
            <div>
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <input type="radio" value="male" {...register("gender")} />
                  Male
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" value="female" {...register("gender")} />
                  Female
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-400 my-2">{errors.gender.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Register"}
            </button>

            {emailExists && (
              <div className="space-y-3 text-center">
                <p className="text-gray-600">Already have an account?</p>
                <Link
                  to="/login"
                  className="block w-full rounded-xl border-2 border-blue-600 py-4 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Login
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}