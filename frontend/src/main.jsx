import React from "react";
import { ToastContainer } from 'react-toastify'
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
                    <App />
                
              </UserProvider> 
              </BrowserRouter>
    </React.StrictMode>
);
