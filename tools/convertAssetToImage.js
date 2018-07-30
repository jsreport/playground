const util = require('util')
const asyncReplace = util.promisify(require('async-replace'))

module.exports = async (db) => {
  console.log('add indexes')
  await Promise.all([
    db.collection('workspaces').createIndex({name: 'text', description: 'text'}),
    db.collection('workspaces').createIndex({userId: 1}),
    db.collection('workspaces').createIndex({name: 1, isPinned: 1}),
    db.collection('workspaces').createIndex({likes: -1})
  ])

  const entities = ['assets', 'data', 'scripts', 'templates', 'xlsxTemplates', 'versions', 'images']
  await Promise.all(entities.map((c) => db.collection(c).createIndex({workspaceId: 1})))

  console.log('converting images to assets')
  const workspaces = await db.collection('images').distinct('workspaceId')
  console.log('found ' + workspaces.length)
  let wCounter = 1

  for (const wid of workspaces) {
    if (wCounter++ % 100 === 0) {
      console.log(`processing ${wCounter}/${workspaces.length}`)
    }

    const images = await db.collection('images').find({workspaceId: wid}).toArray()
    const templates = await db.collection('templates').find({workspaceId: wid}).toArray()

    const imageToAssetMap = {}

    for (const image of images) {
      if (!image.contentType || image.contentType.split('/').length < 2) {
        continue
      }

      let asset = await db.collection('assets').findOne({workspaceId: wid, name: image.name})
      if (asset) {
        continue
      }

      const assetName = `${image.name}.${image.contentType.split('/')[1]}`
      asset = { name: assetName, content: image.content, shortid: image.shortid, workspaceId: wid }
      await db.collection('assets').insert(asset)
      imageToAssetMap[image.name] = assetName
    }

    for (const template of templates.filter((t) => t.content)) {
      const newContent = await asyncReplace(template.content, /{#image ([^{}]{0,150})}/g, async (str, p1, offset, s, done) => {
        const imageName = (p1.indexOf(' @') !== -1) ? p1.substring(0, p1.indexOf(' @')) : p1
        const imageFound = images.find((i) => i.name === imageName)

        if (!imageFound) {
          return done(null)
        }

        const encoding = getImageEncoding(p1, imageName)

        if (!encoding) {
          return done(null)
        }

        if (!imageToAssetMap[imageName]) {
          return done(null)
        }

        done(null, `{#asset ${imageToAssetMap[imageName]} @encoding=${encoding}}`)
      })

      if (template.content !== newContent) {
        await db.collection('templates').update({ _id: template._id }, { $set: { content: newContent } })
      }
    }
  }
  console.log('converting images to assets finished')
}

function getImageEncoding (str, imageName) {
  let encoding = 'dataURI'

  if (str.indexOf(' @') !== -1) {
    const paramRaw = str.replace(imageName, '').replace(' @', '')

    if (paramRaw.split('=').length !== 2) {
      return
    }

    var paramName = paramRaw.split('=')[0]
    var paramValue = paramRaw.split('=')[1]

    if (paramName !== 'encoding') {
      return
    }

    if (paramValue !== 'base64' && paramValue !== 'dataURI') {
      return
    }

    encoding = paramValue
  }

  return encoding
}
