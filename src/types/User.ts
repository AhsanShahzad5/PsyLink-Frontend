export type UserCredentials = {
    name: string;
    email: string;
    password: string;
    role: 'doctor' | 'patient' | '';
}

export type AdminCredentials = {
    username: string;
    password: string;
    role: 'admin' | '';
}