const ObjectID = require('mongodb').ObjectID;
const dbUtils = require('../utils/db');
const allowCors = dbUtils.allowCors;
const connectToDatabase = dbUtils.connectionToDatabase;

const handler = async (req, res) => {
    const { db, client } = await connectToDatabase(process.env.DB_URI, null)
    const collection = await db.collection('posts')
    if (req.method === "GET") {
        const { query: { page="1", limit="10", skip="0"}} = req
        // if get method under root url
        const skipIndex = (parseInt(page) - 1) * parseInt(limit) + parseInt(skip)
        // Select the users collection from the database
        // select new
        const posts = await collection.find({dislike: {$exists: false}})
            .sort({dislikes: 1, views: 1, post_date: -1, topic: 1, isPortrait: -1})
            .limit(parseInt(limit))
            .skip(skipIndex)
            .toArray()
        // Respond with a JSON string of all users in the collection
        // send(res, 200, {posts})
        res.status(200).json({posts})
    }
    if (req.method === 'POST') {
        const { post } = req.body
        const { _id, increaseDislike=0, topic, author }  = post
        // fetch id, update read, like, duration
        console.log('Fetched id as')
        console.log(_id)
        const o_id = new ObjectID(_id)
        delete post["_id"]
        delete post["startTime"]
        delete post["increaseDislike"]
        // console.log(increaseDislike)
        if (increaseDislike > 0) {
            const ret = await collection.updateMany(
                {topic, author},
                {
                    $inc: {dislike: 1}
                }
            )
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
    client.close()
}

module.exports = allowCors(handler)
