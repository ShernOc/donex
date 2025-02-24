import { createContext, useState, useEffect, useContext } from "react";

// Create the UserContext
export const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Register User Function
    const registerUser = async (userData, userType) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userData, userType }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log("Registration successful:", data);
            } else {
                console.error("Registration failed:", data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, registerUser }}>
            {children}
        </UserContext.Provider>
    );
};