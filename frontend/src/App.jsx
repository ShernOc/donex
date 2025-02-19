import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { UserProvider } from "./context/UserContext"; // Import UserProvider

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DonorDashboard from "./pages/DonorDashboard";
import CharityDashboard from "./pages/CharityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DonationPage from "./pages/DonationPage";
import CharityList from "./pages/CharityList";
import BeneficiaryStories from "./pages/BeneficiaryStories";
import AboutPage from "./pages/AboutPage";
import CharityDetail from "./pages/CharityDetail";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <UserProvider> {/* UserProvider is inside AuthProvider to access user state */}
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              <Route path="/charity/dashboard" element={<CharityDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/donate/:charityId?" element={<DonationPage />} />
              <Route path="/charities" element={<CharityList />} />
              <Route path="/stories" element={<BeneficiaryStories />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/charity/:id" element={<CharityDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
