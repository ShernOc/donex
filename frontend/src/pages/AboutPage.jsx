const AboutPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pink-100 text-gray-800 px-6 py-12">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4 animate__animated animate__fadeInDown">
          About Donex
        </h1>
        <p className="text-lg mb-6">
          Donex is a platform designed to make charitable donations seamless and transparent. 
          Our mission is to connect donors with trusted charities and ensure that every 
          contribution makes a real impact.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Mission</h2>
          <p className="text-gray-600">
            We believe in the power of giving. Donex empowers individuals and organizations 
            to contribute to causes they care about with security, efficiency, and impact.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Our Vision</h2>
          <p className="text-gray-600">
            To create a world where generosity thrives, and every donation leads to measurable change.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-700">Maxwel Kirimi</h3>
              <p className="text-gray-500">Software Engineer</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-700">Sherlyne Ochieng</h3>
              <p className="text-gray-500">Software Engineer</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-700">Collins Kathurima</h3>
              <p className="text-gray-500">Software Engineer</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Get Involved</h2>
          <p className="text-gray-600">
            Join us in making the world a better place. Donate, volunteer, or partner with us today.
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;