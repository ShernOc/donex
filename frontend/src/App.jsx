import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import CharityDashboard from './pages/CharityDashboard';
import DonorDashboard from './pages/DonorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonationPage from './pages/DonationPage';
import CharityList from './pages/CharityList';
import BeneficiaryStories from './pages/BeneficiaryStories';
import AboutPage from './pages/AboutPage';
import CharityDetail from './pages/CharityDetail';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Google from './pages/Google';


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserProvider>
        <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/donate/:charityId?" element={<DonationPage />} />
                <Route path="/charities" element={<CharityList />} />
                <Route path="/stories" element={<BeneficiaryStories />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/charity/:id" element={<CharityDetail />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/google" element={<Google />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/donor/dashboard"
                  element={<ProtectedRoute element={<DonorDashboard />} />}
                />
                <Route
                  path="/charity/dashboard"
                  element={<ProtectedRoute element={<CharityDashboard />} />}
                />
                <Route
                  path="/admin/dashboard"
                  element={<ProtectedRoute element={<AdminDashboard />} />}
                />
              </Routes>
            </main>
            <Footer />
      </UserProvider>
    </div>
  );
}

export default App;
