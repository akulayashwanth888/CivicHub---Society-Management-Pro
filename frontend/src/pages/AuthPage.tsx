import { useState, FormEvent } from "react";
import { loginUser, registerUser } from "../services/authService";


type UserRole = "resident" | "admin";

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>("resident");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser({ email, password });
        alert("Login successful");
      } else {
        await registerUser({ name, email, password, role });
        alert("Registration successful. Please login.");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
            C
          </div>
          <h2 className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Join Your Society"}
          </h2>
          <p className="text-indigo-100 mt-2">
            {isLogin
              ? "Sign in to access your dashboard"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setRole("resident")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                role === "resident"
                  ? "bg-white shadow text-indigo-600"
                  : "text-slate-500"
              }`}
            >
              Resident
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                role === "admin"
                  ? "bg-white shadow text-indigo-600"
                  : "text-slate-500"
              }`}
            >
              Admin / Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Register Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Join Now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
