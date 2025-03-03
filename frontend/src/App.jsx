import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import { CharityProvider } from './context/CharityContext';
import {StoryProvider} from './context/StoryContext'
import Home from './pages/Home';
import DonorDashboard from './pages/DonorDashboard';
import CharityDashboard from './pages/CharityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonationPage from './pages/DonationPage';
import CharityList from './pages/CharityList';
import BeneficiaryStories from './pages/BeneficiaryStories';
import AboutPage from './pages/AboutPage';
import CharityDetail from './pages/CharityDetail';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
  // const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <BrowserRouter> */}
      <UserProvider>
      <Navbar />
      <CharityProvider> 
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/charity/dashboard"
            element={
              <ProtectedRoute element={<CharityDashboard />} />
            }
          />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute element={<DonorDashboard />}/>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute element={<AdminDashboard />}/>
            }
          />
        </Routes>
      </main> 
    
    </StoryProvider>
     </CharityProvider>
    <Footer />
  </UserProvider>
{/* </BrowserRouter> */}
    </div>
  );
}

export default App;