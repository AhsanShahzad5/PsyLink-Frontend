import { useState, useEffect } from "react";

const useDoctorDetails = (doctorId: string | undefined) => {
  const [doctorDetails, setDoctorDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refetchCounter, setRefetchCounter] = useState<number>(0);

  const refetch = () => {
    setRefetchCounter(prev => prev + 1);
  };

  useEffect(() => {
    // Don't fetch if no doctorId is provided
    if (!doctorId) {
      return;
    }

    const fetchDoctorDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/doctor/details/personal?id=${doctorId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch doctor details: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setDoctorDetails(data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId, refetchCounter]);

  return { doctorDetails, loading, error, refetch };
};

export default useDoctorDetails;