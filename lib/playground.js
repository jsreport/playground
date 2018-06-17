const nanoid = require('nanoid')

module.exports = (reporter) => {
  return {
    pageSize: 20,
    findWorkspace (q) {
      return reporter.documentStore.collection('workspaces').findOne(q)
    },

    async loadWorkspace (workspace, user, userId) {
      reporter.logger.debug(`Loading workspace ${workspace._id}`)
      await reporter.documentStore.collection('workspaces').update({ _id: workspace._id }, {
        $set: {
          views: (workspace.views || 0) + 1
        }
      })

      if (workspace.userId) {
        workspace.user = await reporter.documentStore.collection('users').findOne({ _id: workspace.userId })
        workspace.canEdit = workspace.userId === userId
      }

      if (user) {
        workspace.hasLike = (await reporter.documentStore.collection('likes').findOne({userId: user._id})) != null
      }

      return workspace
    },

    async saveWorkspace (data, currentWorkspace, userId) {
      const workspacesCollection = reporter.documentStore.collection('workspaces')

      const workspace = {
        name: data.workspace.name,
        description: data.workspace.description,
        default: data.workspace.default
      }

      if (currentWorkspace) {
        if (currentWorkspace.userId !== userId) {
          reporter.logger.debug(`Saving workspace fork ${currentWorkspace._id}`)
          const newWorkspace = await workspacesCollection.insert({ shortid: nanoid(7), userId, ...workspace })
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

              await col.insert({ ...e, ...modifiedEntity, workspaceId: newWorkspace._id })
            }
          }
          return newWorkspace
        }

        reporter.logger.debug(`Saving existing workspace ${currentWorkspace._id}`)
        await workspacesCollection.update({_id: currentWorkspace._id}, { $set: workspace })
        return {...currentWorkspace, ...workspace}
      }

      reporter.logger.debug(`Saving new workspace ${workspace.name}`)
      return workspacesCollection.insert({ shortid: nanoid(7), userId: userId, ...workspace })
    },

    changeWorkspaceOwner (workspaceId, userId) {
      reporter.logger.debug(`changeWorkspaceOwner ${workspaceId}`)
      return reporter.documentStore.collection('workspaces').update({
        _id: workspaceId
      }, { $set: { userId } })
    },

    async addLike (currentWorkspace, user) {
      reporter.logger.debug(`addLike ${currentWorkspace._id}`)
      const existingLike = await reporter.documentStore.collection('likes').findOne({
        userId: user._id,
        workspaceId: currentWorkspace._id
      })

      const workspace = await reporter.documentStore.collection('workspaces').findOne({
        _id: currentWorkspace._id
      })

      if (!existingLike) {
        await reporter.documentStore.collection('likes').insert({
          userId: user._id,
          workspaceId: workspace._id
        })

        await reporter.documentStore.collection('workspaces').update({
          _id: workspace._id
        }, {
          $set: {
            likes: (workspace.likes || 0) + 1
          }
        })
      }
    },

    async removeLike (currentWorkspace, user) {
      reporter.logger.debug(`removeLike ${currentWorkspace._id}`)
      const existingLike = await reporter.documentStore.collection('likes').findOne({
        userId: user._id,
        workspaceId: currentWorkspace._id
      })

      const workspace = await reporter.documentStore.collection('workspaces').findOne({
        _id: currentWorkspace._id
      })

      if (existingLike) {
        await reporter.documentStore.collection('likes').remove({userId: user._id, workspaceId: workspace._id})

        await reporter.documentStore.collection('workspaces').update({
          _id: workspace._id
        }, {
          $set: {
            likes: workspace.likes - 1
          }
        })
      }
    },

    async findOrInsertUser (user) {
      const existingUser = await reporter.documentStore.collection('users')
        .findOne({ externalId: user.externalId, provider: user.Provider })

      if (existingUser) {
        return existingUser
      }

      return reporter.documentStore.collection('users').insert(user)
    },

    findUser (q) {
      return reporter.documentStore.collection('users').findOne(q)
    },

    async searchWorkspaces (search) {
      reporter.logger.debug(`searchWorkspaces ${search}`)
      const workspaces = await reporter.documentStore.collection('workspaces').find(
        { $text: { $search: search } },
        { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } }).limit(this.pageSize)

      await this._expandUser(workspaces)
      return workspaces
    },

    async listWorkspaces (type, page, userId) {
      reporter.logger.debug(`listWorkspaces ${type} ${page}`)
      const query = {}
      if (type === 'users') {
        query.userId = userId
      }

      if (type === 'examples') {
        query.isPinned = true
      }

      let cursor = reporter.documentStore.collection('workspaces').find(query).skip(this.pageSize * page).limit(this.pageSize)

      if (type === 'examples') {
        cursor = cursor.sort({name: 1})
      }

      if (type === 'users') {
        cursor = cursor.sort({modificationDate: -1})
      }

      if (type === 'popular') {
        cursor = cursor.sort({likes: -1})
      }

      const workspaces = await cursor.toArray()
      await this._expandUser(workspaces)

      return {
        items: workspaces,
        count: await reporter.documentStore.collection('workspaces').find(query).count()
      }
    },

    async _expandUser (workspaces) {
      const usersCache = {}
      for (const w of workspaces) {
        if (!usersCache[w.userId]) {
          usersCache[w.userId] = await reporter.documentStore.collection('users').findOne({ _id: w.userId })
        }

        w.user = usersCache[w.userId]
      }
    }
  }
}
