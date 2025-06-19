import { useState } from 'react';

const ExtraItemCard = ({ item, isOwner, onEdit, onDelete, showContactInfo }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600">
              {item.quantity} {item.unit}
            </p>
            {item.price && (
              <p className="text-sm font-medium text-green-600 mt-1">{item.price}</p>
            )}
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-700">{item.description}</p>

          {showContactInfo && !isOwner && (
            <div className="border-t pt-3">
              {showContact ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Contact Owner:</h4>
                    <button
                      onClick={() => setShowContact(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {item.owner?.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> 
                      <a
                        href={`tel:${item.owner?.phone}`}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        {item.owner?.phone}
                      </a>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>
                      <a
                        href={`mailto:${item.owner?.email}`}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        {item.owner?.email}
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Show Contact Info
                </button>
              )}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Posted {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraItemCard;