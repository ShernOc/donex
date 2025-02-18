import { Heart, Share2, MessageCircle } from 'lucide-react';

const BeneficiaryStories = () => {
  const stories = [
    {
      id: 1,
      title: "A New Beginning for Sarah's Family",
      charity: "Hope Foundation",
      date: "March 15, 2024",
      content: "Thanks to generous donors, Sarah's family received the support they needed during a difficult time...",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80",
      likes: 245,
      comments: 18,
    },
    {
      id: 2,
      title: "Building Schools in Rural Communities",
      charity: "Education for All",
      date: "March 12, 2024",
      content: "With your support, we've built 3 new schools reaching over 500 children in remote areas...",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&w=800&q=80",
      likes: 189,
      comments: 12,
    },
    {
      id: 3,
      title: "Clean Water Initiative Success",
      charity: "Global Health Project",
      date: "March 10, 2024",
      content: "Our latest water purification project has provided clean drinking water to over 1,000 families...",
      image: "https://images.unsplash.com/photo-1512578659172-63a4634c05ec?ixlib=rb-4.0.3&w=800&q=80",
      likes: 312,
      comments: 24,
    },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Impact Stories</h1>
          <p className="text-gray-600 mt-2">Real stories of lives changed through your generosity</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-rose-600">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>{story.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-rose-600">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>{story.comments}</span>
                    </button>
                  </div>
                  <button className="flex items-center text-gray-500 hover:text-rose-600">
                    <Share2 className="h-5 w-5 mr-1" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
            Load More Stories
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryStories;