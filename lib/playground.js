const nanoid = require('nanoid')
const Request = require('jsreport-core').Request

module.exports = (reporter) => {
  return {
    pageSize: 100,
    findWorkspace (q) {
      return reporter.documentStore.internalCollection('workspaces').findOne(q)
    },

    async loadWorkspace (workspace, user, userId) {
      reporter.logger.debug(`Loading workspace ${workspace._id}`)

      await reporter.documentStore.internalCollection('workspaces').update({ _id: workspace._id }, {
        $set: {
          views: (workspace.views || 0) + 1,
          lastVisitDate: new Date()
        }
      })

      if (workspace.userId) {
        workspace.user = await reporter.documentStore.internalCollection('users').findOne({ _id: workspace.userId })
        workspace.canEdit = workspace.userId === userId
      }

      return workspace
    },

    async saveWorkspace (data, currentWorkspace, userId, isAnonymous) {
      const workspacesCollection = reporter.documentStore.internalCollection('workspaces')

      const workspace = {
        name: data.workspace.name,
        description: data.workspace.description,
        default: data.workspace.default
      }

      if (!currentWorkspace.__isInitial) {
        if (currentWorkspace.userId !== userId) {
          reporter.logger.debug(`Saving workspace fork ${currentWorkspace._id}`)
          const newWorkspace = await workspacesCollection.insert({ shortid: nanoid(8), userId, isAnonymous, ...workspace })

          for (const name in reporter.documentStore.collections) {
            if (name === 'settings' || name === 'workspaces') {
              continue
            }

            const col = reporter.documentStore.collections[name]
            const entities = await col.find({ workspaceId: currentWorkspace._id })
            for (const e of entities) {
              const modifiedEntity = data.entities.find((ee) => ee._id === e._id) || {}
              delete modifiedEntity._id
              delete e._id

              const entityToInsert = { ...e, ...modifiedEntity, workspaceId: newWorkspace._id }
              const entityWithConvertedBuffers = col.convertBase64ToBufferInEntity([entityToInsert])[0]

              await col.insert(entityWithConvertedBuffers, Request({
                context: {
                  userId,
                  workspace: newWorkspace
                }
              }))
            }
          }
          return newWorkspace
        }

        reporter.logger.debug(`Saving existing workspace ${currentWorkspace._id}`)

        await workspacesCollection.update({ _id: currentWorkspace._id }, { $set: workspace })

        return { ...currentWorkspace, ...workspace }
      }

      reporter.logger.debug(`Saving new workspace ${workspace.name}`)
      return workspacesCollection.insert({ shortid: nanoid(8), userId, isAnonymous, _id: currentWorkspace._id, ...workspace })
    },

    async removeWorkspace (workspaceId, userId) {
      const w = await reporter.documentStore.internalCollection('workspaces').findOne({
        _id: workspaceId
      })

      if (!w) {
        reporter.logger.debug(`Could not find workspace with _id ${workspaceId} to remove`)
        throw new Error(`workspace does not exists or you don't have permissions to remove it`)
      }

      if (w.userId !== userId) {
        reporter.logger.debug(`Could not remove workspace with _id ${workspaceId} because user is not the owner`)
        throw new Error(`workspace does not exists or you don't have permissions to remove it`)
      }

      reporter.logger.debug(`Removing workspace with _id ${workspaceId}`)

      await reporter.documentStore.internalCollection('workspaces').remove({
        _id: workspaceId
      })
    },

    changeWorkspaceOwner (workspaceId, userId) {
      reporter.logger.debug(`changeWorkspaceOwner ${workspaceId}`)
      return reporter.documentStore.internalCollection('workspaces').update({
        _id: workspaceId
      }, { $set: { userId } })
    },

    async findOrInsertUser (user) {
      const existingUser = await reporter.documentStore.internalCollection('users')
        .findOne({ externalId: user.externalId, provider: user.provider })

      if (existingUser) {
        return existingUser
      }

      return reporter.documentStore.internalCollection('users').insert(user)
    },

    findUser (q) {
      return reporter.documentStore.internalCollection('users').findOne(q)
    },

    async searchWorkspaces (search) {
      reporter.logger.debug(`searchWorkspaces ${search}`)

      const searchParams = [
        // we escape the search term here to ensure that we search for the exact term and avoid making
        // a search that uses some characters (like -, spaces) that causes a special search in mongo
        { $text: { $search: `"${search}"` } },
        { score: { $meta: 'textScore' } }
      ]

      const workspaces = await reporter.documentStore.internalCollection('workspaces').find(...searchParams)
        .sort({ score: { $meta: 'textScore' } }).limit(this.pageSize)

      await this._expandUser(workspaces)

      return {
        items: workspaces
      }
    },

    async listUserWorkspaces (userId) {
      reporter.logger.debug(`listUserWorkspaces ${userId}`)

      const workspaces = await reporter.documentStore.internalCollection('workspaces')
        .find({ userId })
        .sort({ name: 1 })

      await this._expandUser(workspaces)

      return {
        items: workspaces
      }
    },

    async listPopularWorkspaces () {
      reporter.logger.debug(`listPopularWorkspaces`)

      const workspaces = await reporter.documentStore.internalCollection('workspaces')
        .find({})
        .limit(this.pageSize)
        .sort({ views: -1 })

      await this._expandUser(workspaces)

      return {
        items: workspaces
      }
    },

    async _expandUser (workspaces) {
      const usersCache = {}
      for (const w of workspaces) {
        if (!usersCache[w.userId]) {
          usersCache[w.userId] = await reporter.documentStore.internalCollection('users').findOne({ _id: w.userId })
        }

        w.user = usersCache[w.userId]
      }
    }
  }
}
