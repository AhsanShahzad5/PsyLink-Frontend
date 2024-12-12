import { useState } from "react";

const PasswordReset = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setIsButtonDisabled(true); // Disable button
    setMessage("");

    try {
      // Call the backend API
      const response = await fetch("http://localhost:8000/api/user/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email in the request body
      });

      const data = await response.json();

      if (response.ok) {
        // Success message from backend
        setMessage(`Success: ${data.message}`);
      } else {
        // Error message from backend
        setMessage(`Error: ${data.error || "Failed to send password reset email."}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      // Re-enable button after 10 seconds
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 10000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[25rem] p-6 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Password Reset</h2>
        <p className="text-sm text-gray-600 mb-6">
          Provide the email address associated with your account to recover your password.
        </p>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full px-4 py-2 mt-1 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button
          onClick={handlePasswordReset}
          disabled={isButtonDisabled}
          className={`w-full px-4 py-2 text-white font-medium rounded-md ${
            isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primaryHover"
          }`}
        >
          Reset Password
        </button>
        {message && <p className={`mt-4 text-sm ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>}
        <div className="mt-6 flex justify-between text-sm">
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
