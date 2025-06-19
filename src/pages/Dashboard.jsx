import { useState, useEffect } from 'react';
import { productsAPI, extraItemsAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';
import ExtraItemForm from '../components/ExtraItemForm';
import ExtraItemCard from '../components/ExtraItemCard';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showExtraItemForm, setShowExtraItemForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingExtraItem, setEditingExtraItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, extraItemsRes] = await Promise.all([
        productsAPI.getAll(),
        extraItemsAPI.getMyItems(),
      ]);
      setProducts(productsRes.data);
      setExtraItems(extraItemsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }
      fetchData();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleExtraItemSubmit = async (itemData) => {
    try {
      if (editingExtraItem) {
        await extraItemsAPI.update(editingExtraItem.id, itemData);
      } else {
        await extraItemsAPI.create(itemData);
      }
      fetchData();
      setShowExtraItemForm(false);
      setEditingExtraItem(null);
    } catch (error) {
      console.error('Error saving extra item:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteExtraItem = async (id) => {
    try {
      await extraItemsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting extra item:', error);
    }
  };

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
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-8 text-sm font-medium border-b-2 ${
                  activeTab === 'products'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('extra-items')}
                className={`py-4 px-8 text-sm font-medium border-b-2 ${
                  activeTab === 'extra-items'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Extra Items ({extraItems.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Product
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <p className="text-gray-500 text-lg">No products yet</p>
                    <p className="text-gray-400">Start by adding your first product!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={(product) => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'extra-items' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Extra Items</h2>
                  <button
                    onClick={() => setShowExtraItemForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Extra Item
                  </button>
                </div>

                {extraItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏪</div>
                    <p className="text-gray-500 text-lg">No extra items yet</p>
                    <p className="text-gray-400">Share your surplus items with others!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {extraItems.map((item) => (
                      <ExtraItemCard
                        key={item.id}
                        item={item}
                        isOwner={true}
                        onEdit={(item) => {
                          setEditingExtraItem(item);
                          setShowExtraItemForm(true);
                        }}
                        onDelete={handleDeleteExtraItem}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showExtraItemForm && (
        <ExtraItemForm
          item={editingExtraItem}
          onSubmit={handleExtraItemSubmit}
          onCancel={() => {
            setShowExtraItemForm(false);
            setEditingExtraItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;