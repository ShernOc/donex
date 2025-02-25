import { createContext, useState, useEffect, useContext } from "react";
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"
export const UserContext = createContext();
export const useUser = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [navigate]=useState();
    // Load user from token on mount
    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token]);

    // Register User Function
    const registerUser = async (formData, userType, navigate) => {
        try {
            toast.loading("Registering...")
            const response = await fetch("https://donex-uq5f.onrender.com/register", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, userType }),
            });
    
            const data = await response.json();
            toast.dismiss();
    
            if (response.ok) {
                toast.success(data.msg || "Registration successful!");
                navigate("/login"); 
            } else {
                toast.error(data.error || "Registration failed.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Something went wrong. Please try again.");
            console.error("Registration failed:", error);
        }
    };
    
      // LOGIN
      const loginUser = (email, password) => 
        {
            toast.loading("Logging you in ... ")
            fetch("https://donex-uq5f.onrender.com/login",{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    email, password
                })
            })
            .then((resp)=>resp.json())
            .then((response)=>{
                if(response.access_token){
                    toast.dismiss()
    
                    sessionStorage.setItem("token", response.access_token);
    
                    setToken(response.access_token)
    
                    fetch('https://donex-uq5f.onrender.com/current_user',{
                        method:"GET",
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${response.access_token}`
                        }
                    })
                    .then((response) => response.json())
                    .then((response) => {
                      if(response.email){
                              setUser(response)
                            }
                    });
    
                    toast.success("Successfully Logged in")
                    navigate("/")
                }
                else if(response.error){
                    toast.dismiss()
                    toast.error(response.error)
    
                }
                else{
                    toast.dismiss()
                    toast.error("Failed to login")
    
                }
              
                
            })
        };

    // current_user function 
    const fetchCurrentUser = async () => {
        try {
            const response = await fetch("https://donex-uq5f.onrender.com/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                localStorage.setItem("user", JSON.stringify(data));
            } else {
                console.error("Failed to fetch user:", data.msg);
                logoutUser(); // Logout if token is invalid
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            logoutUser();
        }
    };

    // Logout Function
    const logoutUser = async () => {
        try {
            await fetch("https://donex-uq5f.onrender.com/logout", {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            setUser(null);
            setToken("");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, registerUser, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};