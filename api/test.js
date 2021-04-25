const url = require('url')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}


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
    if (req.method === 'POST') {
        const { post: { _id, views, visitedDate, totalDuration } } = req.body
        // fetch id, update read, like, duration
        console.log('Fetched id as')
        console.log(_id)
        const o_id = new ObjectID(_id)
        await collection
            .updateOne({_id: o_id},
                {
                    $set: { views, visitedDate, totalDuration }
                }
            )
        res.status(200).send({_id})
    }
}

module.exports = allowCors(handler)
