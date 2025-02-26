import{ Routes, Route} from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/UserContext';
import { CharityProvider } from './context/CharityContext';
// import {DonorProvider} from './context/DonorContext';
// import {StoryProvide} from './context/StoryContext'


import './App.css'

import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute'; 
import Profile from './pages/ProfilePage';
import Github from './pages/Github';
import Google from './pages/Google';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('authToken')); 

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <BrowserRouter>
      <ToastContainer> */}
      <UserProvider>
      <Navbar />
      <CharityProvider>
      {/* <DonorProvider> */}
      {/* <StoryProvide> */}
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
          {/* profile */}
          <Route path="/profile" element={<Profile />} />
          {/* github/google */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="github" element={<Github />} />
          <Route path="/google" element={<Google />} />


          {/* Protect Login and Register routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute element={<LoginPage />} isAuthenticated={isAuthenticated} />
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute element={<Register />} isAuthenticated={isAuthenticated} />
            }
          />
        </Routes>             
      </main>
      {/* </StoryProvide> */}
      {/* </DonorProvider> */}
      </CharityProvider>
      <Footer />
       </UserProvider>
      {/* </ToastContainer>
      </BrowserRouter>  */}
    </div>

  );
}

export default App;
