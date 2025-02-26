import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            const data = await response.json();

            if (response.ok) {
                setProfile(data);
                localStorage.setItem("user", JSON.stringify(data));
            } else {
                console.error("Failed to fetch profile:", data.msg);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    return (
        <ProfileContext.Provider value={{ profile, fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};