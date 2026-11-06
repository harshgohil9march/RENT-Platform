import {createContext, useState, useContext, Children} from 'react';
import type {ReactNode} from 'react';

interface User{
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loginContext: (userData: User) => void;
    logoutContext: () => void;
}

// Create the empty global instance
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The Provider wraps your app and holds the actual memory state
export const AuthProvider = ({children}: {children: ReactNode}) =>{
    const [user, setUser] = useState<User | null>(null);

    const loginContext = (userData: User) => setUser(userData);
    const logoutContext = () => setUser(null);

    return (
    <AuthContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily grab the user anywhere (e.g., const { user } = useAuth(); )
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within an AuthProvider');

    return context;
};