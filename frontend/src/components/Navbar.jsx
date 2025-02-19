import { Link } from 'react-router-dom';
import { Heart, LogIn, UserPlus, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div>
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="font-bold text-xl text-gray-800">Donex</span>
            </Link>
          </div>

          {/* Navbar Links (desktop version) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
              Home
            </Link>
            <Link to="/charities" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
              Charities
            </Link>
            <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-lg font-medium">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-1 bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register</span>
            </Link>
          </div>

          {/* Hamburger Icon (mobile version) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link to="/charities" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
              Charities
            </Link>
            <Link to="/stories" className="text-gray-600 hover:text-gray-900 text-lg font-medium">
              Impact Stories
            </Link>
            <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-lg font-medium">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-1 bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition"
            >
              <UserPlus className="h-5 w-5" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
