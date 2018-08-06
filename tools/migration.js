const convertImagesToAssets = require('./convertAssetToImage')
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://localhost:27017'
const database = 'playground'

async function migrate () {
  const client = await MongoClient.connect(connectionString)
  const db = client.db(database)

  console.log('adding user and modificationDate')

  await db.collection('workspaces').updateMany({}, {$set: { userId: 'migration', modificationDate: new Date() }})
  console.log('recalculating workspace shortid')
  const workspaces = await db.collection('workspaces').find({}).project({ _id: 1, shortid: 1, version: 1 }).toArray()
  const cache = {}
  let wCounter = 1
  for (const w of workspaces) {
    if (wCounter++ % 10000 === 0) {
      console.log(`processing ${wCounter}/${workspaces.length}`)
    }
    cache[`${w.shortid}-${w.version}`] = w._id.toString()
    await db.collection('workspaces').update({_id: w._id}, {$set: {shortid: `${w.shortid}-${w.version}`}})
  }

  const collections = ['assets', 'data', 'scripts', 'templates', 'xlsxTemplates', 'images']

  for (const c of collections) {
    console.log('migrating ' + c)
    const entities = await db.collection(c).find({}).project({_id: 1, workspaceShortid: 1, workspaceVersion: 1}).toArray()
    let eCounter = 0
    for (const e of entities) {
      if (eCounter++ % 10000 === 0) {
        console.log(`processing ${eCounter}/${entities.length}`)
      }
      if (!cache[`${e.workspaceShortid}-${e.workspaceVersion}`]) {
        console.log(`workpsace not in cache for ${e.workspaceShortid}-${e.workspaceVersion}`)
        continue
      }
      await db.collection(c).update({_id: e._id}, { $set: { workspaceId: cache[`${e.workspaceShortid}-${e.workspaceVersion}`] } })
    }
  }

  await convertImagesToAssets(db)

  client.close()
}

migrate().catch(console.error)
