import { useEffect, useState } from "react";

const BeneficiaryStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/stories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStories((prev) => [...prev, ...data]);; // adds new stories as they are written
        setTotalPages(data.total_pages);

      } else {
        setError("Failed to fetch stories.");
        console.error("Failed to fetch stories:", data.msg);
      }
    } catch (error) {
      setError("Error fetching all the stories");
      console.error("Error fetching approved charities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
      fetchStories(page + 1);
    }
  };

  if (loading) return <p>Loading stories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;


  return (
    <div className="flex-1 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Impact Stories</h1>
          <p className="text-gray-600 mt-2">Real stories of lives changed through your generosity</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-pink-100 rounded-lg shadow-sm overflow-hidden">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-rose-600 font-medium">{story.charity}</span>
                  <span className="text-sm text-gray-500">{story.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{story.title}</h3>
                <p className="text-gray-600 mb-4">{story.content}</p>
                
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {page < totalPages && (
        <div className="text-center mt-8">
          <button onClick={handleLoadMore}className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
          {loading ? "Loading..." : "Load More Stories"}
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryStories;

