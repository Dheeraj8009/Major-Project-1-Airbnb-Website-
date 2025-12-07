const express = require('express');
const router = express.Router();

// Index for users
router.get('/', (req, res) => {
  res.send('User index page');
});

// Show for a specific user
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Details of user with ID: ${userId}`);
});

// Post  Users
router.post('/', (req, res) => {
  res.send('Post users action triggered');
});

// Delete Users
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User with ID: ${userId} has been deleted`);
});

module.exports = router;

