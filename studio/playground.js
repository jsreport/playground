
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
      const shouldInvokeSave = this.current.canEdit
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
        await this.open(this.current)
      }

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
    await Promise.all(entities.map((v) => Studio.openTab({ _id: v._id })))

    if (Studio.playground.current.default) {
      const defaultEntity = entities.find((e) => e.shortid === Studio.playground.current.default)
      if (defaultEntity) {
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

    this.startupReloadTrigger = true
  }
})
