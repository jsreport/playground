/* import Studio from 'jsreport-studio'
import save from './save.js'
import initialize from './initialize.js'
import setDefault from './setDefault.js'
import addToolbarComponents from './addToolbarComponents.js'
import Startup from './Startup.js'
*/
import Studio from 'jsreport-studio'
import Startup from './Startup'
import SaveModal from './SaveModal.js'
import LogoutButton from './LogoutButton.js'
import LoginModal from './LoginModal.js'
import RenameModal from './RenameModal.js'
import { getQueryParameter, removeFacebookQuery } from './utils'

Studio.workspaces = {
  save: async () => {
    Studio.workspaces.current = await Studio.api.post('/api/playground/workspace', {
      data: {
        name: 'untitled',
        ...Studio.workspaces.current
      }
    })

    await Studio.store.dispatch(Studio.editor.actions.updateHistory())
    await Studio.store.dispatch(Studio.editor.actions.saveAll())
    Studio.workspaces.current = await Studio.api.get('api/playground/workspace')
  },

  open: (w) => {
    Studio.workspaces.current = w
    Studio.reset()
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Get Started' })
  },

  create: async () => {
    Studio.workspaces.current = null
    Studio.reset()
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Get Started' })
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
  if (!Studio.workspaces.current) {
    return '/'
  }

  return Studio.workspaces.current.user != null
    ? `/w/${Studio.workspaces.current.user.username}/${Studio.workspaces.current.shortid}`
    : `/w/anon/${Studio.workspaces.current.shortid}`
}

Studio.toolbarVisibilityResolver = (text) => {
  return text === 'Run' || text === 'Download' || text === 'Run to new tab' || text === 'Reformat' || text === 'settings'
}

Studio.addToolbarComponent((props) => <div
  className='toolbar-button' onClick={invokeSave}>
  <i className='fa fa-floppy-o' />Save All</div>)

removeFacebookQuery()
const isEmbed = getQueryParameter('embed') != null

Studio.initializeListeners.push(async () => {
  Studio.workspaces.user = await Studio.api.get('api/playground/user')
  Studio.workspaces.current = await Studio.api.get('api/playground/workspace')

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

Studio.readyListeners.push(async () => {
  Studio.addToolbarComponent((props) => <div style={{backgroundColor: '#E67E22'}}
    className='toolbar-button' onClick={() => Studio.openModal(RenameModal)}>
    <i className='fa fa-edit' />{Studio.workspaces.current && Studio.workspaces.current.name ? Studio.workspaces.current.name : 'Untitled ...'}</div>)

  Studio.addToolbarComponent((props) => <div className='toolbar-button' style={{backgroundColor: '#2ECC71'}}
    onClick={() => Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Get Started' })}>
    <i className='fa fa-home' />Home</div>)

  if (isEmbed) {
    Studio.collapseLeftPane()
  } else {
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Get Started' })
  }
})

/*

const getQueryParameter = (name) => {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

const originalError = console.error.bind(console)
let errorLimit = 10
const logError = (m) => {
  if (errorLimit-- < 0) {
    return
  }

  Studio.api.post('/odata/errors', { data: { message: m, url: window.location.href } })
}

window.onerror = function (msg, url, line, col, error) {
  var extra = !col ? '' : '\ncolumn: ' + col
  extra += !error ? '' : '\nerror: ' + error
  msg += '\nurl: ' + url + '\nline: ' + line + extra
  logError(msg)
}

console.error = function (...args) {
  const msg = args.map((a) => a.stack || a).join()
  logError(msg)
  originalError(...args)
}

Studio.workspaces = {
  current: {},
  save: save,
  setDefault: setDefault
}
const isEmbed = getQueryParameter('embed') != null
addToolbarComponents(isEmbed)

Studio.addEditorComponent('Help', Startup)
Studio.shouldOpenStartupPage = false
Studio.initializeListeners.push(initialize)
Studio.locationResolver = () => `/studio/workspace/${Studio.workspaces.current.shortid}/${Studio.workspaces.current.version}`
Studio.removeHandler = (id) => Studio.removeEntity(id)

Studio.previewListeners.push((req, entities) => {
  req.template.workspaceShortid = Studio.workspaces.current.shortid
  req.template.workspaceVersion = Studio.workspaces.current.version
})

Studio.readyListeners.push(async () => {
  if (isEmbed) {
    Studio.collapseLeftPane()
  } else {
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Get Started' })
  }

  const entities = Studio.getAllEntities()
  if (entities.length < 5) {
    await Promise.all(entities.map((v) => Studio.openTab({ _id: v._id })))
  }

  if (Studio.workspaces.current.default) {
    const entity = Studio.getEntityByShortid(Studio.workspaces.current.default, false)
    if (entity) {
      Studio.openTab({ _id: entity._id })
    }
  }
})

Studio.referencesLoader = async (entitySet) => {
  const nameAttribute = Studio.entitySets[entitySet].nameAttribute
  const referenceAttributes = Studio.entitySets[entitySet].referenceAttributes

  let response = await Studio.api.get(`/odata/${entitySet}?$filter=workspaceVersion eq ${Studio.workspaces.current.version} and workspaceShortid eq '${Studio.workspaces.current.shortid}'&$select=${referenceAttributes}&$orderby=${nameAttribute}`)

  return response.value
}

*/
