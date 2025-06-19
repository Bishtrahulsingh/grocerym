import { useState, useEffect } from 'react';
import { extraItemsAPI } from '../services/api';
import ExtraItemCard from '../components/ExtraItemCard';

const Marketplace = () => {
  const [extraItems, setExtraItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExtraItems();
  }, []);

  const fetchExtraItems = async () => {
    try {
      const response = await extraItemsAPI.getAll();
      setExtraItems(response.data);
    } catch (error) {
      console.error('Error fetching extra items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = extraItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketplace</h1>
          <p className="text-gray-600 mb-6">
            Discover extra items shared by community members
          </p>
          
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏪</div>
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No items found matching your search' : 'No extra items available'}
            </p>
            <p className="text-gray-400">
              {searchTerm ? 'Try a different search term' : 'Check back later for new listings!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ExtraItemCard
                key={item.id}
                item={item}
                isOwner={false}
                showContactInfo={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;