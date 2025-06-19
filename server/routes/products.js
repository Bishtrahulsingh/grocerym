import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Get user's products
router.get('/', authenticateToken, (req, res) => {
  try {
    const userProducts = global.products.filter(product => product.userId === req.user.id);
    res.json(userProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, quantity, unit, category, expiryDate, notes } = req.body;

    const product = {
      id: generateId(),
      userId: req.user.id,
      name,
      quantity,
      unit,
      category,
      expiryDate,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    global.products.push(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = global.products.findIndex(
      product => product.id === req.params.id && product.userId === req.user.id
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = {
      ...global.products[productIndex],
      ...req.body,
      updatedAt: new Date()
    };

    global.products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const productIndex = global.products.findIndex(
      product => product.id === req.params.id && product.userId === req.user.id
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    global.products.splice(productIndex, 1);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;