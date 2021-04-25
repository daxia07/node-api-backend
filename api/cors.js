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
    send(res, 200, 'ok!')
}

module.exports = cors(handler)