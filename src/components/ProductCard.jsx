const ProductCard = ({ product, onEdit, onDelete }) => {
  const getCategoryEmoji = (category) => {
    const emojis = {
      fruits: '🍎',
      vegetables: '🥕',
      dairy: '🥛',
      meat: '🥩',
      grains: '🌾',
      beverages: '🥤',
      snacks: '🍿',
      frozen: '🧊',
      other: '📦',
    };
    return emojis[category] || '📦';
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getCategoryEmoji(product.category)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Quantity:</span>
            <span className="text-sm font-medium">
              {product.quantity} {product.unit}
            </span>
          </div>

          {product.expiryDate && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expires:</span>
              <span
                className={`text-sm font-medium ${
                  isExpired(product.expiryDate)
                    ? 'text-red-600'
                    : isExpiringSoon(product.expiryDate)
                    ? 'text-orange-600'
                    : 'text-gray-900'
                }`}
              >
                {new Date(product.expiryDate).toLocaleDateString()}
                {isExpired(product.expiryDate) && ' (Expired)'}
                {isExpiringSoon(product.expiryDate) && !isExpired(product.expiryDate) && ' (Soon)'}
              </span>
            </div>
          )}

          {product.notes && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 italic">{product.notes}</p>
            </div>
          )}
        </div>

        {(isExpired(product.expiryDate) || isExpiringSoon(product.expiryDate)) && (
          <div
            className={`mt-4 p-2 rounded-md text-sm ${
              isExpired(product.expiryDate)
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-orange-50 text-orange-800 border border-orange-200'
            }`}
          >
            {isExpired(product.expiryDate)
              ? '⚠️ This item has expired'
              : '⏰ This item expires soon'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;