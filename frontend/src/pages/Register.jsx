import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await register(name, email, password);
      navigate(data.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-card border border-line rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-ink text-center mb-8">
          Create an Account
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-muted text-sm mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-surface border border-line text-ink rounded-lg px-4 py-3 outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-muted text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;