const ObjectID = require('mongodb').ObjectID
const probe = require('probe-image-size');
const dbUtils = require('../utils/db');
const allowCors = dbUtils.allowCors;
const connectToDatabase = dbUtils.connectionToDatabase;

// Create cached connection variable

const handler = async (req, res) => {
    const db = await connectToDatabase(process.env.DB_URI, null)
    const collection = await db.collection('posts')
    if (req.method === 'POST') {
        console.log(req.body)
        const { body: { _id, src } } = req
        const result = await probe(src, { rejectUnauthorized: false });
        const isPortrait = result.height > result.weight
        console.log(result)
        const o_id = new ObjectID(_id)
        await collection
            .updateOne({_id: o_id},
                {
                    $set: { isPortrait }
                }
            )
        res.status(200).send({width: result.height,
            height: result.width, isPortrait})
    }
}

module.exports = allowCors(handler)
