
import Studio from 'jsreport-studio'

function updateTitle (workspaceName) {
  document.title = workspaceName || 'jsreport playground'
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

      const isNewWorkspace = this.current.__isInitial === true
      const shouldInvokeSave = this.current.canEdit === true
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
        await Studio.store.dispatch(Studio.editor.actions.saveAll())
        this.current = await Studio.api.get('api/playground/workspace')
      } else {
        if (isNewWorkspace) {
          await Studio.store.dispatch(Studio.editor.actions.saveAll())
        }

        await this.open(this.current)
      }

      if (this.startupReload) {
        this.startupReload()
      }
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

    if (Studio.playground.current.default) {
      const entities = Studio.getAllEntities().filter((e) => e.__entitySet !== 'folders')
      const defaultEntity = entities.find((e) => e.shortid === Studio.playground.current.default)

      if (defaultEntity) {
        Studio.collapseEntity({ _id: defaultEntity._id }, false, { parents: true, self: false })
        Studio.openTab({ _id: defaultEntity._id })
      }
    }
  },

  async create () {
    updateTitle(null)
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

    if (this.startupReload) {
      this.startupReload()
    }
  }
})
