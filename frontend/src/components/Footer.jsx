import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="font-bold text-xl">Donex</span>
            </div>
            <p className="mt-4 text-gray-400">
              Empowering change through generosity. Connect with causes that matter.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/charities" className="text-gray-400 hover:text-white">Find Charities</a></li>
              <li><a href="/stories" className="text-gray-400 hover:text-white">Impact Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>support@donatehope.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+254704490333</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>123 Ngong Lane, NG 100</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest impact stories.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className=""
              />
              <button className="bg-rose-500 px-4 py-2 rounded-r-md hover:bg-rose-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 Donex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;