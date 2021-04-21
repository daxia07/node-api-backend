// Filename: api-routes.js
// Initialize express router
const router = require('express').Router()
const Post = require('./models/posts')

// test with http://localhost:8080/api/posts?page=1&limit=3
router.get('/posts', async function (req, res) {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const skipIndex = (page-1) * limit
        console.log(page)
        const posts = await Post.find()
            .sort({_id: 1})
            .limit(limit)
            .skip(skipIndex)
            .exec();
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})


// Get specific one
router.get('/posts/:id', (req, res) => {

})

// Get new one
router.get('/posts/new', (req, res) => {

})

// Post behavior
router.patch('/posts/:id', (req, res) => {

})

// Export API routes
module.exports = router