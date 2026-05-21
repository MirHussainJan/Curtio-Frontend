import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {

    const getStoredUser = () => {
        const data =
            localStorage.getItem("LoginUser") ||
            localStorage.getItem("user");

        if (!data) return {};

        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    };

    const storedUser = getStoredUser();

    const [formData, setFormData] = useState({
        name: storedUser.name || "",
        email: storedUser.email || "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("apiToken");

  // Validate passwords match when either is provided
  if ((formData.password || formData.confirmPassword) && formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  // Build payload only with fields that have values
  const payload = {};
  if (formData.name.trim()) payload.name = formData.name.trim();
  if (formData.password) payload.password = formData.password;

  if (!Object.keys(payload).length) {
    toast.error("No changes to save");
    return;
  }

  try {
    setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${baseUrl}/auth/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Profile updated successfully");
      // Update stored user info
      const updatedUser = { ...storedUser, ...payload };
      localStorage.setItem("LoginUser", JSON.stringify(updatedUser));
      // Clear password fields
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } else {
      toast.error(data.message || "Failed to update profile");
    }
  } catch (err) {
    console.error(err);
    toast.error("Network error while updating profile");
  } finally {
    setLoading(false);
  }
};

    const preventCopyPaste = (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <Toaster position="top-right" />
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-6 md:p-10 border-2 border-gray-200">

                <div className="mt-4 mb-6 flex flex-col gap-4">

                        <div className="">
                            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
                                <ArrowLeft size={16} /> Back to Dashboard
                            </Link>
                        </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Profile Settings
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Manage your account information
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <p className="text-xs md:text-sm text-indigo-600 font-semibold py-2 px-3 border border-indigo-600 rounded-full bg-indigo-600/10 inline-flex items-center">
                            <Mail size={14} className="mr-2" />
                            {formData.email}
                        </p>

                        <p className="text-xs md:text-sm text-green-600 font-semibold py-2 px-3 border border-green-600 rounded-full bg-green-600/10 inline-flex items-center">
                            <ShieldCheck size={14} className="mr-2" />
                            Verified
                        </p>

                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Full Name
                        </label>

                        <div className="flex items-center border border-gray-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                            <User size={20} className="text-gray-400 mr-3" />

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                New Password
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">

                                <Lock size={20} className="text-gray-400 mr-3" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="New password"
                                    className="w-full outline-none bg-transparent"
                                    onCopy={preventCopyPaste}
                                    onPaste={preventCopyPaste}
                                    onCut={preventCopyPaste}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-500 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Confirm Password
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">

                                <Lock size={20} className="text-gray-400 mr-3" />

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className="w-full outline-none bg-transparent"
                                    onCopy={preventCopyPaste}
                                    onPaste={preventCopyPaste}
                                    onCut={preventCopyPaste}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="text-gray-500 cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold py-3 rounded-2xl disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}