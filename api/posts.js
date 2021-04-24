// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

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

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async (req, res) => {
    // Get a database connection, cached or otherwise,
    // using the connection string environment variable as the argument
    const db = await connectToDatabase(process.env.DB_URI)
    // res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    const collection = await db.collection('posts')
    // Select the "users" collection from the database
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
        const skipIndex = (page-1) * limit

        // Select the users collection from the database
        // select new
        const posts = await collection.find({})
            .sort({views: 1, post_date: -1, isPortrait: 0, topic: 1, totalDuration: -1 })
            .limit(limit)
            .skip(skipIndex)
            .toArray()

        // Respond with a JSON string of all users in the collection
        res.status(200).json({ posts })
    } else if (req.method === 'POST') {
        const { data } = req.body
        // fetch id, update read, like, duration
        for (let item of data ) {
            const { _id, views, visitedDate, totalDuration } = item
            const o_id = new ObjectID(_id)
            // for each element do update one
            // update likes, views, visitedDate, totalDuration
            await collection
                .updateOne({_id: o_id},
                    {$inc:{ views, totalDuration },
                        $set: { visitedDate }}
                )
        }
        res.status(200).json({ data })
    }
}
