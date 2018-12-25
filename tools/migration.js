const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://localhost:27017'
const database = 'playground'
const nanoid = require('nanoid')

async function migrate () {
  const client = await MongoClient.connect(connectionString)
  const db = client.db(database)

  console.log('creating workspace folders')

  const workspaces = await db.collection('workspaces').find({}).project({ _id: 1 }).toArray()
  let wCounter = 1
  for (const w of workspaces) {
    if (wCounter++ % 10000 === 0) {
      console.log(`processing ${wCounter}/${workspaces.length}`)
    }

    const collections = ['assets', 'data', 'scripts', 'templates', 'xlsxTemplates', 'images']
    let allEntities = []
    for (const c of collections) {
      const entities = await db.collection(c).find({
        workspaceId: w._id.toString()
      }).project({ _id: 1, name: 1 }).toArray()

      allEntities = allEntities.concat(entities.map(e => ({
        __entitySet: c,
        ...e
      })))
    }

    let unique = true
    for (const e of allEntities) {
      if (!unique) {
        continue
      }

      if (allEntities.find(a => a._id !== e._id && a.name === e.name)) {
        unique = false
      }
    }

    if (unique) {
      continue
    }

    for (const c of collections) {
      if (!allEntities.find(e => e.__entitySet === c)) {
        continue
      }

      const folder = {
        name: c,
        workspaceId: w._id.toString(),
        shortid: nanoid(8)
      }

      await db.collection('folders').insertOne(folder)

      for (const e of allEntities.filter(e => e.__entitySet === c)) {
        await db.collection(c).updateOne({
          _id: e._id
        }, {
          $set: {
            folder: {
              shortid: folder.shortid
            }
          }
        })
      }
    }
  }

  client.close()
}

migrate().catch(console.error)
