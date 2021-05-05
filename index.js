// FileName: index.js
// Import express
require('dotenv').config()
const dbUtils = require('./utils/db');
const getSongs = require('./utils/onedrive')
const connectToDatabase = dbUtils.connectionToDatabase;

//TODO: fetch the latest token
// call api to get token
const {INTIAL_TOKEN} = process.env

const main = async () => {
    const { db, client } = await connectToDatabase(process.env.DB_URI, null)
    songs = await getSongs(INTIAL_TOKEN)
    const collection = await db.collection('songs')
    for (let i=0; i < songs.length; i++) {
        const {fileId} = songs[i]
        const query = { fileId };
        delete songs[i].fileId
        const update = { "$set": songs[i] };
        const options = { upsert: true };
        try {
            await collection.updateOne(
                query, update, options
            )
        } catch (e) {
            console.log(e)
            continue
        }
    }
    client.close()
}

main();