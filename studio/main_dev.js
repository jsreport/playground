import Studio from 'jsreport-studio'
import save from './save.js'
import initialize from './initialize.js'
import setDefault from './setDefault.js'
import addToolbarComponents from './addToolbarComponents.js'
import Startup from './Startup.js'

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
