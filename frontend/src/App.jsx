import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import { CharityProvider } from './context/CharityContext';
import { StoryProvider } from './context/StoryContext'
import { DonationProvider } from './context/DonationContext.jsx';
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
import RegisterAdmin from './pages/RegisterAdmin.jsx';
import ProfilePage from './pages/ProfilePage';

// Paypal 
import PayPal from './pages/PayPal.jsx';


import ProtectedRoute from './components/ProtectedRoute';
import Github from './pages/Github';
import Google from './pages/Google';
import CharityVerificationForm from './pages/CharityVerification';


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserProvider>
        <Navbar />
        <CharityProvider>
          <DonationProvider>
            <StoryProvider>
              <main className="flex-1 flex flex-col">

                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/donate/:charityId?" element={<DonationPage />} />
                  <Route path="/charities" element={<CharityList />} />
                  <Route path="/stories" element={<BeneficiaryStories />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/charity/:id" element={<CharityDetail />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/github" element={<Github />} />
                  <Route path="/google" element={<Google />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/register_admin" element={<RegisterAdmin/>} />
                  <Route path="/paypal" element={<PayPal />} />

                  <Route
                    path="/charity/dashboard"
                    element={
                      <ProtectedRoute element={<CharityDashboard />} />
                    }
                  />
                  <Route
                    path="/donor/dashboard"
                    element={
                      <ProtectedRoute element={<DonorDashboard />} />
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute element={<AdminDashboard />} />
                    }
                  />
                </Routes>
              </main>

            </StoryProvider>
          </DonationProvider>
        </CharityProvider>
        <Footer />
      </UserProvider>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
