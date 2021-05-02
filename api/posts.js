const ObjectID = require('mongodb').ObjectID;
const dbUtils = require('../utils/db');
const allowCors = dbUtils.allowCors;
const connectToDatabase = dbUtils.connectionToDatabase;

const handler = async (req, res) => {
    const db = await connectToDatabase(process.env.DB_URI, null)
    const collection = await db.collection('posts')
    if (req.method === "GET") {
        if (!parseInt(req.query.page)) {
            req.query.page = 1;
        }
        if (!parseInt(req.query.limit)) {
            req.query.limit = 10;
        }
        // if get method under root url
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const skipIndex = (page - 1) * limit

        // Select the users collection from the database
        // select new
        const posts = await collection.find({})
            .sort({dislikes: 1, views: 1, post_date: -1, topic: 1, isPortrait: -1})
            .limit(limit)
            .skip(skipIndex)
            .toArray()
        // Respond with a JSON string of all users in the collection
        // send(res, 200, {posts})
        res.status(200).json({posts})
    }
    if (req.method === 'POST') {
        const { post } = req.body
        const { _id, increaseDislike=0, topic, author, post_date }  = post
        // fetch id, update read, like, duration
        console.log('Fetched id as')
        console.log(_id)
        const o_id = new ObjectID(_id)
        delete post["_id"]
        delete post["startTime"]
        delete post["increaseDislike"]
        console.log(topic, author, post_date)
        if (increaseDislike > 0) {
            const ret = await collection.updateMany(
                {topic, author, post_date},
                {
                    $inc: {dislike: 1}
                }
            )
            console.log(ret)
        } else {
            await collection
                .updateOne({_id: o_id},
                    {
                        $set: { ...post }
                    }
                )
        }

        res.status(200).send({_id})
    }
}

module.exports = allowCors(handler)
