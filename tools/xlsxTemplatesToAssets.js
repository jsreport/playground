const nanoid = require('nanoid')

module.exports = async (db, workspaceId) => {
  const xlsxTemplates = await db.collection('xlsxTemplates').find({ workspaceId }).toArray()
  if (xlsxTemplates.length === 0) {
    return
  }

  const xlsxTemplateToAssetMap = new Map()

  for (const xlsxTemplate of xlsxTemplates) {
    if (!xlsxTemplateToAssetMap.has(xlsxTemplate.shortid)) {
      let newAsset
      let tryCount = 0

      while (newAsset == null) {
        const assetName = `${'_'.repeat(tryCount) + xlsxTemplate.name}.xlsx`

        const existingEntity = await findInAll(db, workspaceId, assetName, xlsxTemplate.folder)

        if (existingEntity) {
          tryCount++
          continue
        }

        newAsset = {
          name: assetName,
          modificationDate: new Date(),
          creationDate: new Date(),
          shortid: nanoid(7),
          content: xlsxTemplate.contentRaw,
          folder: xlsxTemplate.folder || null,
          workspaceId
        }
        await db.collection('assets').insertOne(newAsset)
      }

      xlsxTemplateToAssetMap.set(xlsxTemplate.shortid, newAsset)
    }
  }

  const templatesToMigrate = await db.collection('templates').find({ workspaceId, $or: [{ xlsxTemplate: { $exists: true, $ne: null } }, { baseXlsxTemplate: { $exists: true } }] }).toArray()

  for (const template of templatesToMigrate) {
    let continueUpdate = false

    // handle jsreport-xlsx migration
    if (template.xlsxTemplate != null) {
      continueUpdate = true

      const xlsxTemplateRef = template.xlsxTemplate

      template.xlsxTemplate = null

      if (xlsxTemplateRef.shortid != null && xlsxTemplateToAssetMap.has(xlsxTemplateRef.shortid)) {
        template.xlsx = template.xlsx || {}
        template.xlsx.templateAssetShortid = xlsxTemplateToAssetMap.get(xlsxTemplateRef.shortid).shortid
      }
    }

    // handle jsreport-html-to-xlsx migration
    if (template.baseXlsxTemplate != null) {
      continueUpdate = true

      const baseXlsxTemplateRef = template.baseXlsxTemplate

      template.baseXlsxTemplate = null

      if (baseXlsxTemplateRef.shortid != null && xlsxTemplateToAssetMap.has(baseXlsxTemplateRef.shortid)) {
        template.htmlToXlsx = template.htmlToXlsx || {}
        template.htmlToXlsx.templateAssetShortid = xlsxTemplateToAssetMap.get(baseXlsxTemplateRef.shortid).shortid
      }
    }

    if (continueUpdate) {
      await db.collection('templates').update({ _id: template._id, workspaceId }, { $set: template })
    }
  }

  for (const xlsxTemplate of xlsxTemplates) {
    await db.collection('xlsxTemplates').remove({ _id: xlsxTemplate._id, workspaceId })
  }
}

async function findInAll (db, workspaceId, name, folder) {
  for (const col of ['templates', 'scripts', 'assets', 'data', 'folders', 'tags', 'components']) {
    const existingEntity = await db.collection(col).findOne({ name, workspaceId, folder: folder || null })
    if (existingEntity) {
      return existingEntity
    }
  }
  return null
}
