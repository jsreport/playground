
import Studio from 'jsreport-studio'

function updateTitle (workspaceName) {
  const separatorIndex = document.title.lastIndexOf('|')

  if (!workspaceName) {
    document.title = document.title.slice(separatorIndex + 2)
  } else {
    if (separatorIndex === -1) {
      document.title = `${workspaceName} | ${document.title}`
    } else {
      document.title = `${workspaceName} | ${document.title.slice(separatorIndex + 2)}`
    }
  }
}

export default () => ({
  async init () {
    this.user = await Studio.api.get('api/playground/user')
    this.current = await Studio.api.get('api/playground/workspace')
  },

  async save () {
    if (this.lock) {
      return
    }
    try {
      updateTitle(this.current.name)
      await Studio.store.dispatch(Studio.entities.actions.flushUpdates())
      this.lock = true
      const shouldInvokeSave = this.current.canEdit
      const newEntities = Studio.getAllEntities().filter((e) => e.__isNew)
      const entities = Studio.getAllEntities().filter((e) => e.__isLoaded).map((e) => Studio.entities.actions.prune(e))

      this.current = await Studio.api.post('/api/playground/workspace', {
        data: {
          workspace: {
            name: 'untitled',
            ...this.current
          },
          entities
        }
      })

      await Studio.store.dispatch(Studio.editor.actions.updateHistory())

      if (shouldInvokeSave) {
        const prevDefault = newEntities.find(e => e._id === this.current.default)
        let newDefault

        await Studio.store.dispatch(Studio.editor.actions.saveAll())

        if (prevDefault) {
          newDefault = Studio.getAllEntities().find(e => {
            return (
              e.shortid === prevDefault.shortid &&
              e.name === prevDefault.name &&
              e.__entitySet === prevDefault.__entitySet
            )
          })
        }

        if (newDefault) {
          // updating workspace default since id has changed because entity was new
          this.current = await Studio.api.post('/api/playground/workspace', {
            data: {
              workspace: {
                ...this.current,
                default: newDefault._id
              }
            }
          })
        }
      } else {
        await Studio.reset()
        Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
        Studio.getAllEntities().forEach((e) => Studio.openTab({_id: e._id}))
      }

      this.current = await Studio.api.get('api/playground/workspace')
      this.startupReloadTrigger = true
    } finally {
      this.lock = false
    }
  },

  async like () {
    if (!this.current._id || this.lock) {
      return
    }
    try {
      this.lock = true

      if (this.current.hasLike) {
        this.current.hasLike = false
        await Studio.api.del('/api/playground/like')
      } else {
        this.current.hasLike = true
        await Studio.api.post('/api/playground/like')
      }
      this.startupReloadTrigger = true
    } finally {
      this.lock = false
    }
  },

  async open (w) {
    updateTitle(w.name)
    this.current = w
    await Studio.store.dispatch(Studio.editor.actions.updateHistory())
    this.current = await Studio.api.get('api/playground/workspace')

    await Studio.reset()
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
    const entities = Studio.getAllEntities()
    if (entities.length > 0) {
      Studio.openTab({ _id: entities[0]._id })
    }
  },

  async create () {
    this.current = { canEdit: true, __isInitial: true }
    await Studio.reset()
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
    Studio.openNewModal('templates')
  },

  async remove (w) {
    const wid = w._id

    await Studio.api.del(`api/playground/workspaces/${wid}/remove`)

    if (w._id === this.current._id) {
      this.current = { canEdit: true, __isInitial: true }
      updateTitle(null)
      await Studio.reset()
      this.current = await Studio.api.get('api/playground/workspace')
      Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
    }
  }
})
