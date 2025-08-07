import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Validation helper functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\+?\d{10}$/.test(phone);
const isValidPassword = (password) => password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
const isValidName = (name) => /^[a-zA-Z ]+$/.test(name);

const Register = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    phone: "",
    bio: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", bio: ""
  });

  // Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  // Validate all fields on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let errorMsg = "";
    if (name === "email") {
      if (!value.trim()) errorMsg = "Email is required";
      else if (!isValidEmail(value)) errorMsg = "Enter a valid email";
    } else if (name === "phone") {
      if (value && !isValidPhone(value)) errorMsg = "Phone must be 10 digits";
    } else if (name === "password") {
      if (!value.trim()) errorMsg = "Password is required";
      else if (!isValidPassword(value)) errorMsg = "Min 8 chars, 1 letter & number";
    } else if (name === "confirmPassword") {
      if (!value.trim()) errorMsg = "Confirm password";
      else if (value !== formData.password) errorMsg = "Passwords do not match";
    } else if (name === "name") {
      if (!value.trim()) errorMsg = "Name is required";
      else if (!isValidName(value)) errorMsg = "Only letters & spaces";
    } else if (name === "bio" && !value.trim()) {
      errorMsg = "Bio is required";
    }

    setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const isFormValid = () => {
    const errors = {
      name: !formData.name.trim() ? "Name is required" : !isValidName(formData.name) ? "Only letters & spaces" : "",
      email: !formData.email.trim() ? "Email is required" : !isValidEmail(formData.email) ? "Enter a valid email" : "",
      password: !formData.password.trim() ? "Password is required" : !isValidPassword(formData.password) ? "Min 8 chars, 1 letter & number" : "",
      confirmPassword: !formData.confirmPassword.trim() ? "Confirm password" : formData.password !== formData.confirmPassword ? "Passwords do not match" : "",
      phone: formData.phone && !isValidPhone(formData.phone) ? "Phone must be 10 digits" : "",
      bio: !formData.bio.trim() ? "Bio is required" : "",
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(err => err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isFormValid()) {
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${url}auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Error styling helper
  const inputErrorClass = (field) => fieldErrors[field] ? "border-red-300" : "border-gray-300";

  const handleLoginClick = () => navigate("/login");

  // Style: Compact, grid-based, no unnecessary margins
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-indigo-200">
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left Section: Branding/Logo (optional, can be hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center w-2/5 bg-gradient-to-br from-red-600 to-indigo-700 p-6">
          {/* Add your logo here */}
          <div className="flex flex-col items-center">
            <svg className="w-24 h-24 mb-4" fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="16" width="48" height="32" rx="6" fill="#fff" fillOpacity="0.15" />
              <rect x="16" y="24" width="32" height="16" rx="3" fill="#fff" fillOpacity="0.25" />
              <rect x="24" y="28" width="16" height="8" rx="2" fill="#fff" fillOpacity="0.5" />
              <rect x="28" y="36" width="8" height="2" rx="1" fill="#fff" fillOpacity="0.7" />
            </svg>
            <h2 className="text-2xl font-extrabold text-white mb-1 text-center">AI News Portal</h2>
            <p className="text-indigo-100 text-sm text-center">Join our community. Stay informed.</p>
          </div>
        </div>

        {/* Right Section: Form (Compact, no scroll on desktop) */}
        <div className="w-full md:w-3/5 flex flex-col p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Create Your Account</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">Join us and start your journey!</p>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${inputErrorClass("name")}`}
                  placeholder="John Doe"
                  required
                />
                {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${inputErrorClass("email")}`}
                  placeholder="you@example.com"
                  required
                />
                {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${inputErrorClass("password")}`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${inputErrorClass("confirmPassword")}`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirm}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirm ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </svg>
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="REPORTER">Reporter</option>
                </select>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${inputErrorClass("phone")}`}
                  placeholder="+919876543210"
                />
                {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${inputErrorClass("bio")}`}
                placeholder="A passionate journalist..."
                required
              />
              {fieldErrors.bio && <p className="text-xs text-red-500 mt-1">{fieldErrors.bio}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Account"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-600 text-center">{success}</p>}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">Already have an account?</p>
            <button
              onClick={handleLoginClick}
              className="mt-1 text-red-600 font-medium text-sm hover:text-red-800 focus:outline-none focus:underline transition"
            >
              Login Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
