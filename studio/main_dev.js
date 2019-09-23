import React from 'react'
import Studio from 'jsreport-studio'
import Startup from './Startup'
import ToolbarSaveForkButton from './ToolbarSaveForkButton'
import LogoutButton from './LogoutButton.js'
import AboutModal from './AboutModal'
import LoginModal from './LoginModal.js'
import SaveModal from './SaveModal.js'
import ShareModal from './ShareModal.js'
import RenameModal from './RenameModal.js'
import Playground from './playground.js'
import UserEditor from './UserEditor.js'
import { getQueryParameter, removeFacebookQuery, trim } from './utils'

Studio.setAboutModal(AboutModal)

Studio.playground = Playground()

Studio.locationResolver = () => {
  if (Studio.playground.current.__isInitial) {
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
  await Studio.playground.init()

  if (Studio.playground.user) {
    Studio.addToolbarComponent(() => (
      <div className='toolbar-button'>
        <span><i className='fa fa-user' /> {Studio.playground.user.fullName}</span>
      </div>
    ), 'settingsBottom')
    Studio.addToolbarComponent(LogoutButton, 'settingsBottom')
  } else {
    Studio.addToolbarComponent(() => (
      <div className='toolbar-button' onClick={() => Studio.openModal(LoginModal)}>
        <span><i className='fa fa-sign-in' /> Login</span>
      </div>
    ), 'settingsBottom')
  }
})

function save () {
  if (Studio.playground.user || (!Studio.playground.current.__isInitial && Studio.playground.current.canEdit)) {
    return Studio.playground.save()
  }

  Studio.openModal(SaveModal)
}

Studio.readyListeners.push(async () => {
  if (!isEmbed) {
    Studio.addToolbarComponent((props) => (
      <ToolbarSaveForkButton
        enabled={Studio.getAllEntities().some(e => e.__isDirty)}
        canEdit={Studio.playground.current.__isInitial ? true : Studio.playground.current.canEdit}
        save={save}
      />
    ))

    if (Studio.playground.user) {
      Studio.addToolbarComponent((props) => (
        <div
          className={`toolbar-button ${Studio.playground.current.name == null ? 'disabled' : ''}`}
          onClick={() => Studio.playground.like()}
        >
          <i className='fa fa-heart' title='Like workspace' style={{
            color: (Studio.playground.current.hasLike) ? 'red' : undefined
          }} />
        </div>
      ))
    }
  }

  Studio.addToolbarComponent((props) => (
    <div
      style={{ backgroundColor: '#E67E22', float: 'right' }}
      className='toolbar-button'
      onClick={() => {
        if (!isEmbed) {
          Studio.openModal(RenameModal)
        }
      }}
    >
      <i className={`fa fa-${!isEmbed ? 'pencil' : 'flag'}`} />
      <h1 style={{ display: 'inline', fontSize: '1rem', color: '#FFFFFF' }}>
        {Studio.playground.current.name ? trim(Studio.playground.current.name) : 'Untitled ...'}
      </h1>
    </div>
  ), 'right')

  if (!isEmbed) {
    Studio.addToolbarComponent((props) => (
      <div
        className='toolbar-button'
        style={{ backgroundColor: '#2ECC71' }}
        onClick={() => Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })}
      >
        <i className='fa fa-home' />Home
      </div>
    ), 'right')

    if (Studio.playground.user) {
      Studio.addToolbarComponent((props) => (
        <div className='toolbar-button'>
          <i className='fa fa-user' />{Studio.playground.user.fullName}
        </div>
      ), 'right')
    }

    Studio.addToolbarComponent((props) => (
      <div
        className={`toolbar-button ${Studio.playground.current.name == null ? 'disabled' : ''}`}
        onClick={() => {
          if (Studio.playground.current.name) {
            Studio.openModal(ShareModal)
          }
        }}
      >
        <i className='fa fa-share' />Share
      </div>
    ), 'right')
  } else {
    Studio.addToolbarComponent((props) => (
      <div
        className='toolbar-button'
        onClick={() => (window.open(window.location.href.split('?')[0], '_blank'))}
      >
        <i className='fa fa-desktop' />Full
      </div>
    ), 'right')
  }

  if (isEmbed) {
    Studio.collapseLeftPane()
  } else {
    Studio.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' })
  }

  const entities = Studio.getAllEntities()

  if (Studio.extensions.playground.options.workspaceOpenAllEntities) {
    await Promise.all(entities.filter((e) => e.__entitySet !== 'folders').map((v) => Studio.openTab({ _id: v._id })))
  }

  if (Studio.playground.current.default) {
    const defaultEntity = entities.find((e) => e.shortid === Studio.playground.current.default)

    if (defaultEntity) {
      Studio.collapseEntity({ _id: defaultEntity._id }, false, { parents: true, self: false })
      Studio.openTab({ _id: defaultEntity._id })
    }
  }
})
