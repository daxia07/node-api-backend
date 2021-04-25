const { send } = require('micro')
const microCors = require('micro-cors')

// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const cors = microCors({ allowMethods: ['PUT', 'POST', 'GET'] })


// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
    // If the database connection is cached,
    // use it instead of creating a new connection
    if (cachedDb) {
        return cachedDb
    }

    // If no connection is cached, create a new one
    const client = await MongoClient.connect(uri, { useNewUrlParser: true })

    // Select the database through the connection,
    // using the database path of the connection string
    const db = await client.db(url.parse(uri).pathname.substr(1))

    // Cache the database connection and return the connection
    cachedDb = db
    return db
}

const handler = async (req, res) => {
    const db = await connectToDatabase(process.env.DB_URI)
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
            .sort({views: 1, post_date: -1, isPortrait: -1, topic: 1, totalDuration: -1})
            .limit(limit)
            .skip(skipIndex)
            .toArray()

        // Respond with a JSON string of all users in the collection
        send(res, 200, {posts})
        // res.status(200).json({posts})
    } else if (req.method === 'POST') {
            const { post: { _id, views, visitedDate, totalDuration } } = req.body
            // fetch id, update read, like, duration
            console.log('Fetched id as')
            console.log(_id)
            const o_id = new ObjectID(_id)
            await collection
                .updateOne({_id: o_id},
                    {
                        // $inc:{ views, totalDuration },
                        $set: { views, visitedDate, totalDuration }
                    }
                )
            send(res, 200, 'ok!')
    }
}

module.exports = cors(handler)