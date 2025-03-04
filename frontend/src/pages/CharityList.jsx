import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const CharityList = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/charities', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched approved charities:', data);
        if (data && Array.isArray(data.charities)) {
          setCharities(data.charities);
        } else {
          setCharities([]);
          setError('Invalid data format received.');
        }
      })
      .catch((error) => {
        console.error('Error fetching charities:', error);
        setError('Failed to fetch charities.');
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const filteredCharities = charities.filter((charity) =>
    charity.charity_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading charities...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore our Charities</h1>
          <p className="text-gray-600 mt-2">Find and support causes you care about</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search charities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-100">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {filteredCharities.length === 0 ? (
          <p className="text-gray-500">No verified charities found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharities.map((charity) => (
              <div key={charity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={charity.image || 'https://via.placeholder.com/300'}
                  alt={charity.charity_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {charity.charity_name}
                  </h3>
                  <p className="text-gray-700 mb-4">{charity.email}</p>
                  <div className="flex items-center justify-between">
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
        )}
      </div>
    </div>
  );
};

export default CharityList;
