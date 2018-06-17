import Studio from 'jsreport-studio'
import Startup from './Startup'
import SaveModal from './SaveModal.js'
import LogoutButton from './LogoutButton.js'
import LoginModal from './LoginModal.js'
import RenameModal from './RenameModal.js'
import { getQueryParameter, removeFacebookQuery } from './utils'

Studio.workspaces = {
  save: async () => {
    if (Studio.workspaces.lock) {
      return
    }
    try {
      await Studio.store.dispatch(Studio.entities.actions.flushUpdates())
      Studio.workspaces.lock = true
      const shouldInvokeSave = Studio.workspaces.current.canEdit
      const entities = Studio.getAllEntities().filter((e) => e.__isLoaded).map((e) => Studio.entities.actions.prune(e))

      Studio.workspaces.current = await Studio.api.post('/api/playground/workspace', {
        data: {
          workspace: {
            name: 'untitled',
            ...Studio.workspaces.current
          },
          entities
        }
      })

      await Studio.store.dispatch(Studio.editor.actions.updateHistory())
      if (shouldInvokeSave) {
        await Studio.store.dispatch(Studio.editor.actions.saveAll())
      } else {
        await Studio.reset()
        Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
        Studio.getAllEntities().forEach((e) => Studio.openTab({_id: e._id}))
      }
      Studio.workspaces.current = await Studio.api.get('api/playground/workspace')
      Studio.workspaces.startupReloadTrigger = true
    } finally {
      Studio.workspaces.lock = false
    }
  },

  like: async () => {
    if (!Studio.workspaces.current._id || Studio.workspaces.lock) {
      return
    }
    try {
      Studio.workspaces.lock = true

      if (Studio.workspaces.current.hasLike) {
        Studio.workspaces.current.hasLike = false
        await Studio.api.del('/api/playground/like')
      } else {
        Studio.workspaces.current.hasLike = true
        await Studio.api.post('/api/playground/like')
      }
      Studio.workspaces.startupReloadTrigger = true
    } finally {
      Studio.workspaces.lock = false
    }
  },

  open: async (w) => {
    document.title = w.name
    Studio.workspaces.current = w
    await Studio.store.dispatch(Studio.editor.actions.updateHistory())
    Studio.workspaces.current = await Studio.api.get('api/playground/workspace')

    await Studio.reset()
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
    const entities = Studio.getAllEntities()
    if (entities.length > 0) {
      Studio.openTab({ _id: entities[0]._id })
    }
  },

  create: async () => {
    Studio.workspaces.current = { canEdit: true }
    await Studio.reset()
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
    Studio.openNewModal('templates')
  }
}

function invokeSave () {
  if (Studio.workspaces.user) {
    Studio.workspaces.save()
  } else {
    Studio.openModal(SaveModal, { })
  }
}

Studio.locationResolver = () => {
  if (!Studio.workspaces.current._id) {
    return '/'
  }

  return Studio.workspaces.current.user != null
    ? `/w/${Studio.workspaces.current.user.username}/${Studio.workspaces.current.shortid}`
    : `/w/anon/${Studio.workspaces.current.shortid}`
}

Studio.toolbarVisibilityResolver = (text) => {
  return text === 'Run' || text === 'Download' || text === 'Run to new tab' || text === 'Reformat' || text === 'settings'
}

removeFacebookQuery()
const isEmbed = getQueryParameter('embed') != null

Studio.initializeListeners.push(async () => {
  Studio.workspaces.user = await Studio.api.get('api/playground/user')
  Studio.workspaces.current = (await Studio.api.get('api/playground/workspace')) || { canEdit: true }

  if (Studio.workspaces.user) {
    Studio.addToolbarComponent(() => <div className='toolbar-button'><span><i
      className='fa fa-user' /> {Studio.workspaces.user.fullName}</span></div>, 'settingsBottom')
    Studio.addToolbarComponent(LogoutButton, 'settingsBottom')
  } else {
    Studio.addToolbarComponent(() => <div className='toolbar-button' onClick={() => Studio.openModal(LoginModal)}><span><i
      className='fa fa-sign-in' /> Login</span></div>, 'settingsBottom')
  }
})

Studio.shouldOpenStartupPage = false
Studio.addEditorComponent('Help', Startup)

function trim (str) {
  if (str.length > 30) {
    return str.substring(0, 25) + ' ...'
  }
  return str
}

Studio.readyListeners.push(async () => {
  Studio.addToolbarComponent((props) => <div
    className='toolbar-button' onClick={invokeSave}>
    {Studio.workspaces.current.canEdit
      ? <span><i className='fa fa-floppy-o' /> Save</span>
      : <span><i className='fa fa-clone' /> Fork</span>}
  </div>)

  if (Studio.workspaces.user) {
    Studio.addToolbarComponent((props) => <div className='toolbar-button'
      onClick={() => Studio.workspaces.like()}><i className='fa fa-heart' style={{
        color: (Studio.workspaces.current.hasLike) ? 'red' : 'white'
      }} /></div>)
  }

  Studio.addToolbarComponent((props) => <div style={{backgroundColor: '#E67E22', float: 'right'}}
    className='toolbar-button' onClick={() => Studio.openModal(RenameModal)}>
    <i className='fa fa-pencil' />
    <h1 style={{display: 'inline', fontSize: '1rem', color: '#FFFFFF'}}>
      {Studio.workspaces.current.name ? trim(Studio.workspaces.current.name) : 'Untitled ...'}
    </h1>
  </div>, 'right')

  Studio.addToolbarComponent((props) => <div className='toolbar-button' style={{backgroundColor: '#2ECC71'}}
    onClick={() => Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })}>
    <i className='fa fa-home' />Home</div>, 'right')

  if (isEmbed) {
    Studio.collapseLeftPane()
  } else {
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
  }

  const entities = Studio.getAllEntities()
  if (entities.length < 5) {
    await Promise.all(entities.map((v) => Studio.openTab({ _id: v._id })))
  }

  if (entities.length > 0) {
    Studio.openTab({ _id: entities[0]._id })
  }

  if (Studio.workspaces.current.default) {
    Studio.openTab({ _id: Studio.workspaces.current.default })
  }
})
