import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'animate.css';

const Home = () => {
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/donations/total")
      .then((response) => response.json())
      .then((data) => {
        // Check if data.totalDonations exists and is a number
        if (data && typeof data.totalDonations === 'number') {
          setTotalDonations(data.totalDonations);
        } else {
          console.error("Invalid data format from API:", data);
        }
      })
      .catch((error) => console.error("Error fetching total donations:", error));
  }, []);

  return (
    <div className="flex-1 flex flex-col font-['Poppins']">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white min-h-[80vh] animate__animated animate__fadeIn">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
            alt="People helping"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 py-24 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate__animated animate__fadeIn animate__delay-1s">
                Make a Difference Today
              </h1>
              <p className="text-xl mb-8 animate__animated animate__fadeIn animate__delay-2s">
                Join our community of donors making a real impact. Support causes you care about and track your contribution journey.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/donate/:charityId?"
                  className="bg-rose-500 text-white px-8 py-3 rounded-md hover:bg-rose-600 flex items-center animate__animated animate__bounceIn animate__delay-3s"
                >
                  Start Donating <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/charities"
                  className="bg-white text-gray-900 px-8 py-3 rounded-md hover:bg-gray-100 animate__animated animate__bounceIn animate__delay-4s"
                >
                  Browse Charities
                </Link>
              </div>
            </div>
            
            {/* Total Donations Inside Hero */}
            <section className="mb-20 mt-16">
              <h2 className="text-4xl font-semibold mb-8 animate__animated animate__fadeInUp">
                Total Donations Made
              </h2>
              <h3 className="text-5xl font-bold mb-4">ksh{totalDonations.toLocaleString()}+</h3>
              <p className="text-lg">
                Join thousands of donors in making a positive impact globally.
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="w-full bg-white animate__animated animate__fadeIn animate__delay-6s pt-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between space-x-8">
          {/* Text Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Every Person Deserves a Better Tomorrow</h2>
            <p className="text-xl mb-6">
              No one should have to face the struggles of poverty or lack of any basic needs. Access to basic needs and opportunities can transform lives and entire communities. Together, we can make a difference.
            </p>
            <p className="text-xl mb-6">
              For many girls and women, the lack of access to sanitary towels hinders education, work, and daily life. With your donation, we can provide sanitary products to ensure dignity, comfort, and health, empowering women and girls to pursue their dreams without barriers.
            </p>
            <p className="text-xl mb-6">
              Your contribution can provide our children with families with a safe and healthy environment to grow. Let’s build a world where everyone has the chance to thrive and believe in a brighter future ahead.
            </p>
          </div>
          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80"
              alt="Charity"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full bg-white py-16 animate__animated animate__fadeIn animate__delay-7s">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-xl mb-8">
            We are a passionate group of individuals dedicated to making a meaningful impact. Through collaboration, transparency, and genuine care, we are working towards a future where everyone has access to the essentials of life—food, clean water, sanitation, and education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 p-6 rounded-lg animate__animated animate__fadeIn animate__delay-8s">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                Our mission is to empower individuals and communities by providing access to basic needs and opportunities for a better tomorrow. We believe that everyone deserves dignity, comfort, and a chance to thrive.
              </p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg animate__animated animate__fadeIn animate__delay-9s">
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                Our vision is a world where every person has the chance to fulfill their potential, free from the struggles of poverty and injustice. We aim to build sustainable change that leaves a lasting legacy for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-gray-50 py-16 animate__animated animate__fadeIn animate__delay-10s">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Donors Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg mb-4">"It feels good to know that my donation is making a tangible difference in the lives of those who need it most. I'm proud to be part of such a wonderful cause."</p>
              <p className="font-semibold">John D.</p>
              <p className="text-gray-600">Long-time Donor</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg mb-4">"As a mother, I feel proud knowing that my donation is helping provide sanitary products for young girls. It’s a small act, but it makes a big difference!"</p>
              <p className="font-semibold">Sarah T.</p>
              <p className="text-gray-600">Empowered Donor</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg mb-4">"I've seen firsthand how access to clean water can change a community. I’m grateful to contribute to such a vital mission."</p>
              <p className="font-semibold">Michael R.</p>
              <p className="text-gray-600">Community Advocate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white animate__animated animate__fadeIn animate__delay-11s">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-rose-500" />
              </div>
              <h3 className="text-4xl font-bold mb-2">$2.5M+</h3>
              <p className="text-gray-600">Donations Raised</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-rose-500" />
              </div>
              <h3 className="text-4xl font-bold mb-2">10K+</h3>
              <p className="text-gray-600">Active Donors</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-rose-500" />
              </div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-gray-600">Verified Charities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section className="w-full bg-gray-50 animate__animated animate__fadeIn animate__delay-12s">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Charities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kenya Red Cross Society */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80"
                alt="Kenya Red Cross Society"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Kenya Red Cross Society</h3>
                <p className="text-gray-600 mb-4">
                  Dedicated to alleviating human suffering and empowering communities in Kenya through various humanitarian initiatives.
                </p>
                <a
                  href="https://www.redcross.or.ke/"
                  className="text-rose-500 font-semibold hover:text-rose-600"
                  target="_blank" rel="noopener noreferrer"
                >
                  Learn More →
                </a>
              </div>
            </div>

            {/* Amref Health Africa */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80"
                alt="Amref Health Africa"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Amref Health Africa</h3>
                <p className="text-gray-600 mb-4">
                  Focused on improving health care in Kenya by addressing the needs of vulnerable populations, especially women and children.
                </p>
                <a
                  href="https://amref.org/kenya/"
                  className="text-rose-500 font-semibold hover:text-rose-600"
                  target="_blank" rel="noopener noreferrer"
                >
                  Learn More →
                </a>
              </div>
            </div>

            {/* Shining Hope for Communities (SHOFCO) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80"
                alt="Shining Hope for Communities"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Shining Hope for Communities (SHOFCO)</h3>
                <p className="text-gray-600 mb-4">
                  Combines community advocacy with tangible services to combat urban poverty and gender inequality in Kenya's informal settlements.
                </p>
                <a
                  href="https://shofco.org/"
                  className="text-rose-500 font-semibold hover:text-rose-600"
                  target="_blank" rel="noopener noreferrer"
                >
                  Learn More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;