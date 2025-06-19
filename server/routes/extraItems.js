import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Get all extra items
router.get('/', (req, res) => {
  try {
    const itemsWithOwnerInfo = global.extraItems.map(item => {
      const owner = global.users.find(user => user.id === item.userId);
      return {
        ...item,
        owner: {
          name: owner?.name,
          phone: owner?.phone,
          email: owner?.email
        }
      };
    });
    res.json(itemsWithOwnerInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's extra items
router.get('/my-items', authenticateToken, (req, res) => {
  try {
    const userItems = global.extraItems.filter(item => item.userId === req.user.id);
    res.json(userItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add extra item
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, quantity, unit, description, price } = req.body;

    const item = {
      id: generateId(),
      userId: req.user.id,
      name,
      quantity,
      unit,
      description,
      price,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    global.extraItems.push(item);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update extra item
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const itemIndex = global.extraItems.findIndex(
      item => item.id === req.params.id && item.userId === req.user.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const updatedItem = {
      ...global.extraItems[itemIndex],
      ...req.body,
      updatedAt: new Date()
    };

    global.extraItems[itemIndex] = updatedItem;
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete extra item
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const itemIndex = global.extraItems.findIndex(
      item => item.id === req.params.id && item.userId === req.user.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    global.extraItems.splice(itemIndex, 1);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;