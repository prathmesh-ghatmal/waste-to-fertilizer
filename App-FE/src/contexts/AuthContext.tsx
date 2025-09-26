import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "@/lib/axios";
import { User, UserRole } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: Partial<User> & { password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("waste2fertilizer_token");
    const storedUser = localStorage.getItem("waste2fertilizer_user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("waste2fertilizer_token", token);
      localStorage.setItem("waste2fertilizer_user", JSON.stringify(user));
      setUser(user);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    data: Partial<User> & { password: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/register", data);
      setIsLoading(false);
      return response.status === 201;
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("waste2fertilizer_token");
    localStorage.removeItem("waste2fertilizer_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
