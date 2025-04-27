import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

const useUserDetails = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/user/userDetails/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  return { user, loading, error };
};

export default useUserDetails;
