const express = require('express');
const router = express.Router();


// Index for posts
router.get('/', (req, res) => {
    res.send('Post index page');
});

// Show posts
router.get('/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`Details of post with ID: ${postId}`);
}); 



// Post req for posts
router.post('/', (req, res) => {
    res.send('Post posts action triggered');
});

// Delete Posts
router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    res.send(`Post with ID: ${postId} has been deleted`);
});

module.exports = router;