// receive get request to trigger fetch
// send fetch call router after complete to fetch next
// avoid conflicts
const dbUtils = require('../utils/db');
const allowCors = dbUtils.allowCors;
const connectToDatabase = dbUtils.connectionToDatabase;
const axios = require('axios');

const handler = async (req, res) => {
    const db = await connectToDatabase(process.env.DB_URI, null)
    const collection = await db.collection('posts')
    if (req.method === 'GET') {
        // get one from DB
        console.log(req)
        const {originalUrl}  = req
        console.log(originalUrl)
        const posts = await collection.find({})
        .sort({dislikes: 1, views: 1, post_date: -1, isPortrait: -1, topic: 1})
        .limit(1)
        .toArray()
        const {_id, url:src} = posts[0]
        // send request to another route
        // try {
        //     const data = await axios.post(`/api/dimensions.js`, {
        //         _id, src
        //     })
        //     console.log(data)
        //     res.status(200).json(data)
        // } catch (error) {
        //     console.log(error)            
        // }
        res.status(200).json({_id, src})
    }
}

module.exports = allowCors(handler)
