import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../api/api";
import { authContext } from "../../Context/AuthContext";
import { loginSchema } from "../../schema/authschema";
import { LoginDefaultValues } from "../../defaultValues/AuthDefaultValues";
import type { ILoginObject } from "../../interfaces/auth.interface";

// same Tailwind classes for every input
const inputClass =
  "w-full rounded-xl bg-gray-100 px-5 py-4 outline-none transition focus:ring-2 focus:ring-blue-500";

export default function Login() {
  const navigate = useNavigate();
  const { insertUserToken } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginObject>({
    defaultValues: LoginDefaultValues,
    resolver: zodResolver(loginSchema),
  });

  // handleSubmit calls this function only if ALL validation passed
  async function callLoginAPI(values: ILoginObject) {
    setLoading(true);
    setLoginFailed(false);

    try {
      const response = await axios.post(`${baseURL}/users/signin`, values);

      const userToken = response.data?.data?.token;

      if (userToken) {
        insertUserToken(userToken);
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error("Token was not found in the response");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // 401 => wrong email or wrong password
        if (status === 401) {
          setLoginFailed(true);
        }

        if (message) {
          toast.error(message);
        } else {
          toast.error("Login failed, please try again");
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
          Login
        </h1>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <form noValidate className="space-y-5" onSubmit={handleSubmit(callLoginAPI)}>
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
                autoComplete="current-password"
                placeholder="Enter Your Password"
                className={inputClass}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-400 my-2">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            {loginFailed && (
              <div className="space-y-3 text-center">
                <p className="text-gray-600">Don't have an account?</p>
                <Link
                  to="/register"
                  className="block w-full rounded-xl border-2 border-blue-600 py-4 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Register
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}