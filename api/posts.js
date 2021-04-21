// Import Dependencies
const url = require('url')
const MongoClient = require('mongodb').MongoClient

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
    console.log(req.method)
    console.log(req.originalUrl)
    console.log(req.body)
    const db = await connectToDatabase(process.env.DB_URI)
    // res.header("Access-Control-Allow-Origin", "*");

    // Select the "users" collection from the database
    const collection = await db.collection('posts')
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
    const posts = await collection.find({})
        .sort({_id: 1})
        .limit(limit)
        .skip(skipIndex)
        .toArray()

    // Respond with a JSON string of all users in the collection
    res.status(200).json({ posts })
}
