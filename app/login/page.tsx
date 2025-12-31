"use client";

import { loginAdmin } from "@/lib/actions/admin.actions";
import handleError from "@/lib/utils/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.isAdmin) {
          router.push("/admin-dashboard");
        }
      } catch (error) {
        console.log("Auth check failed, allowing login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const formHandler = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const res = await loginAdmin(formData);
      console.log("Login response:", res);
      if (res.success) {
        setWrongCredentials(false);
        router.push("/admin-dashboard");
      } else {
        setWrongCredentials(true);
      }
    } catch (error) {
      handleError(error);
      setWrongCredentials(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)]  dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)]  dark:bg-[linear-gradient(90deg,rgba(4,7,29,1)_0%,rgba(12,14,35,1)_100%)] flex items-center justify-center px-5 md:px-10 lg:px-20 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full p-4">
              <Lock size={32} className="text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Admin Login
          </h1>
          <p className="text-gray-400">
            Access your portfolio management dashboard
          </p>
        </div>

        {/* Form Card */}
        <form
          action={formHandler}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
        >
          {/* Username Field */}
          <div className="mb-6">
            <label
              className="block text-white mb-2 font-semibold flex items-center gap-2"
              htmlFor="username"
            >
              <User size={18} className="text-purple-400" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label
              className="block text-white mb-2 font-semibold flex items-center gap-2"
              htmlFor="password"
            >
              <Lock size={18} className="text-purple-400" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Error Message */}
        {wrongCredentials && (
          <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-red-400 font-semibold">
              ✕ Invalid credentials. Please try again.
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Only authorized personnel can access this page
        </p>
      </div>
    </div>
  );
}
