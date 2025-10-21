"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DotGrid from "@/app/components/DotGrid";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      const { user } = data;
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "manager") {
        router.push("/dashboard/manager");
      } else if (user.role === "hr") {
        router.push("/dashboard/hr");
      } else {
        router.push("/dashboard/employee");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900 flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={10}
          gap={15}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full text-white"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Login
          </h1>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full bg-white/20 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full bg-white/20 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="bg-red-500/30 text-white text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-6 text-gray-300">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
