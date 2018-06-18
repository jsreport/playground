import Studio from 'jsreport-studio'
import Startup from './Startup'
import LogoutButton from './LogoutButton.js'
import LoginModal from './LoginModal.js'
import RenameModal from './RenameModal.js'
import Playground from './playground.js'
import UserEditor from './UserEditor.js'
import { getQueryParameter, removeFacebookQuery, trim } from './utils'

Studio.playground = Playground()

Studio.locationResolver = () => {
  if (!Studio.playground.current._id) {
    return '/'
  }

  return Studio.playground.current.user != null
    ? `/w/${Studio.playground.current.user.username}/${Studio.playground.current.shortid}`
    : `/w/anon/${Studio.playground.current.shortid}`
}

Studio.toolbarVisibilityResolver = (text) => {
  return text === 'Run' || text === 'Download' || text === 'Run to new tab' || text === 'Reformat' || text === 'settings'
}

removeFacebookQuery()
const isEmbed = getQueryParameter('embed') != null

Studio.shouldOpenStartupPage = false
Studio.addEditorComponent('Help', Startup)
Studio.addEditorComponent('playgroundUser', UserEditor)

Studio.initializeListeners.push(async () => {
  Studio.playground.user = await Studio.api.get('api/playground/user')
  Studio.playground.current = (await Studio.api.get('api/playground/workspace')) || { canEdit: true }

  if (Studio.playground.user) {
    Studio.addToolbarComponent(() => <div className='toolbar-button'><span><i
      className='fa fa-user' /> {Studio.playground.user.fullName}</span></div>, 'settingsBottom')
    Studio.addToolbarComponent(LogoutButton, 'settingsBottom')
  } else {
    Studio.addToolbarComponent(() => <div className='toolbar-button' onClick={() => Studio.openModal(LoginModal)}><span><i
      className='fa fa-sign-in' /> Login</span></div>, 'settingsBottom')
  }
})

Studio.readyListeners.push(async () => {
  Studio.addToolbarComponent((props) => <div
    className='toolbar-button' onClick={() => Studio.playground.save()}>
    {Studio.playground.current.canEdit
      ? <span><i className='fa fa-floppy-o' /> Save</span>
      : <span><i className='fa fa-clone' /> Fork</span>}
  </div>)

  if (Studio.playground.user) {
    Studio.addToolbarComponent((props) => <div className='toolbar-button'
      onClick={() => Studio.playground.like()}><i className='fa fa-heart' style={{
        color: (Studio.playground.current.hasLike) ? 'red' : 'white'
      }} /></div>)
  }

  Studio.addToolbarComponent((props) => <div style={{backgroundColor: '#E67E22', float: 'right'}}
    className='toolbar-button' onClick={() => Studio.openModal(RenameModal)}>
    <i className='fa fa-pencil' />
    <h1 style={{display: 'inline', fontSize: '1rem', color: '#FFFFFF'}}>
      {Studio.playground.current.name ? trim(Studio.playground.current.name) : 'Untitled ...'}
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

  if (Studio.playground.current.default) {
    Studio.openTab({ _id: Studio.playground.current.default })
  }
})
