import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
// import { UserContext } from '../context/UserContext'; // Uncomment this if UserContext exists

export default function LoginPage() {
  // const { login } = useContext(UserContext); // Uncomment if using UserContext
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state before login attempt
    try {
      if (login) {
        await login(email, password); // Assuming login is defined in UserContext
      } else {
        throw new Error('Login function not defined.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.'); // Set error message
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid gap-8">
        <section
          id="back-div"
          className="w-2xl bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl"
        >
          <div className="border-8 border-transparent rounded-xl bg-white dark:bg-gray-900 shadow-xl p-8 m-2">
            <h1 className="text-5xl font-bold text-center cursor-default dark:text-gray-300 text-gray-900">
              Log in
            </h1>
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-lg dark:text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-lg dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  aria-label="Password"
                />
              </div>
              <a href="#" className="text-blue-400 text-sm transition hover:underline">
                Forget your password?
              </a>
              <button
                className="w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                LOG IN
              </button>
            </form>
            <div className="flex flex-col mt-4 text-sm text-center dark:text-gray-300">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 transition hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
            <div id="third-party-auth" className="flex justify-center gap-4 mt-5">
              <button
                className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg"
                aria-label="Login with Google"
              >
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                  alt="Google"
                />
              </button>
              <button
                className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg"
                aria-label="Login with GitHub"
              >
                <img
                  className="w-6 h-6 dark:invert"
                  loading="lazy"
                  src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"
                  alt="GitHub"
                />
              </button>
              <button
                className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg"
                aria-label="Login with Facebook"
              >
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                  alt="Facebook"
                />
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-400 transition hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 transition hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
