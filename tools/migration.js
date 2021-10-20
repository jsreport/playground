const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://127.0.0.1:27017'
const database = 'playground'
const xlsxTemplatesToAssets = require('./xlsxTemplatesToAssets')
const resourcesToAssets = require('./resourcesToAssets')
async function migrate () {
  const client = await MongoClient.connect(connectionString)
  const db = client.db(database)

  const workspaces = await db.collection('workspaces').find({ }).project({ _id: 1 }).skip(95700).toArray()
  let wCounter = 1
  for (const w of workspaces) {
    const workspaceId = w._id.toString()
    if (wCounter++ % 100 === 0) {
      console.log(`processing ${wCounter}/${workspaces.length}`)
    }

    await resourcesToAssets(db, workspaceId)
  }

  client.close()
  console.log('done')
}

migrate().catch(console.error)
