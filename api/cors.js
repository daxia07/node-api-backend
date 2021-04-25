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
    console.log(collection)
    if (req.method === 'POST') {
        const { data } = req.body
        // fetch id, update read, like, duration
        console.log('Fetched data as')
        console.log(data)
        const o_id = new ObjectID("6083ec5d873a6e81a0e9876a")
        await collection
            .updateOne({_id: o_id},
                {
                    // $inc:{ views, totalDuration },
                    $set: { views: 100 }
                }
            )
        // for (let item of data ) {
        //     const { _id, views, visitedDate, totalDuration } = item
        //     console.log(visitedDate)
        //     const o_id = new ObjectID("6083ec5d873a6e81a0e9876a")
        //     // for each element do update one
        //     // update likes, views, visitedDate, totalDuration
        //     await collection
        //         .updateOne({_id: o_id},
        //             {
        //                 // $inc:{ views, totalDuration },
        //                 $set: { views, totalDuration }
        //             }
        //         )
        // }
    }
    send(res, 200, 'ok!')

}

module.exports = cors(handler)