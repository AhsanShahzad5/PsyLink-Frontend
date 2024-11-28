export interface Appointment {
    sessionId: string;
    doctor: string;
  }
  
  export interface PsyncPost {
    postId: string;
    postedOn: string;
  }
  
  export interface Patient {
    id: string;
    name: string;
    time: string;
    date: string;
    email: string;
    age: number;
    gender: string;
    disability: string;
    country: string;
    city: string;
    phone: string;
    appointments: Appointment[];
    psyncPosts: PsyncPost[];
  }
  
  export interface ComplainByPatient {
    patientId: string;
    patientName: string;
  }
  
  export interface ComplainByDoctor {
    doctorId: string;
    doctorName: string;
  }
  
  export interface Query {
    complaintId: string;
    complainBy: ComplainByPatient | ComplainByDoctor;
    type: string;
    description: string;
    images: string[];
    status: "Pending" | "Ongoing";
    dateTime: string;
  }
  