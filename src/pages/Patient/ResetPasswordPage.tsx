import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useParams<{ token: string }>(); // Token from URL
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`http://localhost:8000/api/user/password/reset/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
      } else {
        setMessage(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[25rem] p-6 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Reset Password</h2>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md"
        />
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        />
        <button
          onClick={handlePasswordReset}
          disabled={isSubmitting}
          className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
