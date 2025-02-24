import { createContext, useState, useEffect, useContext } from "react";

// Create the UserContext
export const UserContext = createContext();

// Create a custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};

// Create the provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to log in the user
    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Function to log out the user
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    // Function to update user profile details (e.g., name, phone, profile picture)
    const updateUserProfile = (updatedData) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedData };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, updateUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};