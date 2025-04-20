import React, { createContext, useMemo, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the context
interface SocketContextType {
    socket: Socket | null;
}

// Create the Socket Context with a default value of null
const SocketContext = createContext<Socket | null>(null);

// Custom hook to use the Socket Context
export const useSocket = (): Socket | null => {
    return useContext(SocketContext);
};

// Define the props for the provider
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    // Use useMemo to prevent multiple socket connections
    const socket = useMemo(() => io("http://localhost:8000"), []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
 