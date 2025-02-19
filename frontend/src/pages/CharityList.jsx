import { Link } from 'react-router-dom';
import { Search, Filter, Heart } from 'lucide-react';

const CharityList = () => {
  const charities = [
    {
      id: 1,
      name: 'Save the Children',
      category: 'Children',
      description: 'Providing education and healthcare to children in need worldwide.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80',
      rating: 4.8,
      donorsCount: 1234,
    },
    {
      id: 2,
      name: 'Ocean Conservation Society',
      category: 'Environment',
      description: 'Protecting marine life and preserving ocean ecosystems.',
      image: 'https://images.unsplash.com/photo-1583212292454-39d2a21a3249?ixlib=rb-4.0.3&w=800&q=80',
      rating: 4.6,
      donorsCount: 856,
    },
    {
      id: 3,
      name: 'Global Health Initiative',
      category: 'Healthcare',
      description: 'Providing medical care and health education in developing regions.',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&w=800&q=80',
      rating: 4.9,
      donorsCount: 2156,
    },
  ];

  const categories = ['All', 'Children', 'Environment', 'Healthcare', 'Education', 'Animals', 'Humanitarian'];

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Charities</h1>
          <p className="text-gray-600 mt-2">Find and support causes you care about</p>
        </div>

        {/* Search and Filter */}
<div className="mb-8">
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Search charities..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
      />
      <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
    </div>
    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-white hover:bg-gray-100">
  <Filter className="h-5 w-5 mr-2" />
  Filter
</button>

  </div>
</div>


       {/* Categories */}
<div className="mb-8 overflow-x-auto">
  <div className="flex space-x-4">
    {categories.map((category) => (
      <button
        key={category}
        className="px-4 py-2 text-sm font-medium rounded-full bg-black text-white border border-black hover:border-rose-500 hover:text-rose-500"
      >
        {category}
      </button>
    ))}
  </div>
</div>


        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={charity.image}
                alt={charity.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 text-sm font-medium text-rose-700 bg-rose-100 rounded-full">
                    {charity.category}
                  </span>
                  <div className="flex items-center text-gray-600">
                    <Heart className="h-5 w-5 text-rose-500 mr-1" />
                    {charity.donorsCount} donors
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{charity.name}</h3>
                <p className="text-gray-700 mb-4">{charity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500">
                    ★ <span className="ml-1 text-gray-800">{charity.rating}</span>
                  </div>
                  <Link
                    to={`/donate/${charity.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharityList;
