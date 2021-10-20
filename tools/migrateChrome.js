module.exports = async (db, workspaceId) => {
  const templatesToMigrate = await db.collection('templates').find({ workspaceId, $or: [{ 'chrome.waitForNetworkIddle': { $exists: true } }, { 'chromeImage.waitForNetworkIddle': { $exists: true } }] }).project({ _id: 1, chrome: 1, chromeImage: 1 }).toArray()
  for (const t of templatesToMigrate) {
    if (t.chrome && t.chrome.waitForNetworkIddle) {
      await db.collection('templates').updateOne({ _id: t._id, workspaceId }, { $set: { 'chrome.waitForNetworkIdle': t.chrome.waitForNetworkIddle } })
    }
    if (t.chromeImage && t.chromeImage.waitForNetworkIddle) {
      await db.collection('templates').updateOne({ _id: t._id, workspaceId }, { $set: { 'chromeImage.waitForNetworkIdle': t.chromeImage.waitForNetworkIddle } })
    }
  }
}
