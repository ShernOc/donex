import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogIn, UserPlus, Menu, LogOut } from 'lucide-react';
import { useState, useEffect, useCallback, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {user, logoutUser} = useContext(UserContext); 

  const navigate = useNavigate();


  
  return (
    <nav className="bg-white shadow-md w-full">
      <div className="flex justify-between items-center h-16 px-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-rose-500" />
          <span className="font-bold text-xl text-gray-800">Donex</span>
        </Link>

        {/* Navbar Links (desktop version) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            Home
          </Link>
          <Link to="/charities" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            Charities
          </Link>
          <Link to="/stories" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            Impact Stories
          </Link>
          <Link to="/donate/:charityId?" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
           Donate
          </Link>

          {/* Authentication Links */}
          {user==null ? (
            <>
              <Link to="/login" className="flex items-center space-x-1 bg-rose-500 !text-white px-6 py-2 rounded-md hover:bg-rose-600 transition">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              {/* <Link to="/register" className="flex items-center space-x-1 bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition">
                <UserPlus className="h-5 w-5" />
                <span>Register</span>
              </Link> */}
            </>
          ) : (
            <button onClick={()=>logoutUser()} className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-lg font-medium">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4">
          <Link to="/charities" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            Charities
          </Link>
          <Link to="/stories" onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-gray-900 text-lg font-medium">
            Impact Stories
          </Link>

          {/* Authentication Links in Mobile Menu */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-lg font-medium">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-1 bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition">
                <UserPlus className="h-5 w-5" />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-lg font-medium">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
