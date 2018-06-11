const nanoid = require('nanoid')

module.exports = (reporter) => {
  return {
    findWorkspace (q) {
      return reporter.documentStore.collection('workspaces').findOne(q)
    },

    async loadWorkspace (workspace, user, userId) {
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
        name: data.workspace.name
      }

      if (currentWorkspace) {
        if (currentWorkspace.userId !== userId) {
          // forking
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

        await workspacesCollection.update({_id: currentWorkspace._id}, { $set: workspace })
        return {...currentWorkspace, ...workspace}
      }

      return workspacesCollection.insert({ shortid: nanoid(7), userId: userId, ...workspace })
    },

    changeWorkspaceOwner (workspaceId, userId) {
      return reporter.documentStore.collection('workspaces').update({
        _id: workspaceId
      }, { $set: { userId } })
    },

    async addLike (currentWorkspace, user) {
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
    }
  }
}
