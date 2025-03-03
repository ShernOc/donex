import React from "react";
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import { UserProvider } from "./context/UserContext"; 
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
               <BrowserRouter>
            <UserProvider>  
            <ToastContainer />
            <GoogleOAuthProvider clientId="556662948216-duufjajs5dlct44vgsuukoqtlk8tou1f.apps.googleusercontent.com"> 
                <App />
            
            </GoogleOAuthProvider>;

                   
                
              </UserProvider> 
              </BrowserRouter>
    </React.StrictMode>
);
