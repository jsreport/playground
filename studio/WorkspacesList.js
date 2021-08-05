import React, { Component } from 'react'
import Studio from 'jsreport-studio'
import style from './style.scss'

class WorkspacesList extends Component {
  constructor () {
    super()
    this.state = this.initialState()
    this.tryHide = this.tryHide.bind(this)
  }

  initialState () {
    return { items: [] }
  }

  componentDidMount () {
    this.mounted = true
    window.addEventListener('click', this.tryHide)
  }

  componentWillUnmount () {
    this.mounted = false
    window.removeEventListener('click', this.tryHide)
  }

  contextMenu (e, entity) {
    e.preventDefault()
    this.setState({ contextMenuId: entity._id })
  }

  tryHide (ev) {
    if (this.state.contextMenuId) {
      ev.preventDefault()
      ev.stopPropagation()
      this.setState({ contextMenuId: null })
    }
  }

  onTabActive () {
    this.fetch()
  }

  async fetch () {
    if (this.fetchRequested) {
      return
    }

    this.fetchRequested = true

    let response

    try {
      response = await Studio.api.get(this.props.url)
    } finally {
      this.fetchRequested = false
    }

    if (this.mounted) {
      this.setState({
        items: response.items
      })
    }
  }

  openUser (e, u) {
    if (!u) {
      return
    }

    e.stopPropagation()
    Studio.openTab({ key: 'playgroundUser' + u._id, editorComponentKey: 'playgroundUser', title: u.fullName, user: u })
  }

  renderContextMenu (w) {
    const { onRemove } = this.props

    return (
      <div key='entity-contextmenu' className={style.contextMenuContainer}>
        <div className={style.contextMenu}>
          <div
            className={style.contextButton}
            onClick={(e) => {
              e.stopPropagation()
              onRemove && onRemove(w)
              this.tryHide(e)
            }}
          >
            <i className='fa fa-trash' /> Delete
          </div>
        </div>
      </div>
    )
  }

  renderItem (w) {
    const { contextMenuId } = this.state
    const { editable } = this.props

    let isOwner = false

    if (Studio.playground.user && Studio.playground.user._id === w.userId) {
      isOwner = true
    }

    return (
      <tr
        key={w._id}
        onClick={() => contextMenuId == null && Studio.playground.open(w)}
        onContextMenu={(e) => {
          if (!isOwner) {
            e.preventDefault()
            return
          }

          this.contextMenu(e, w)
        }}
        title={w.description}
      >
        <td className='selection'>
          {w.name}
          {editable !== false && contextMenuId === w._id ? this.renderContextMenu(w) : null}
        </td>
        <td onClick={(e) => contextMenuId == null && this.openUser(e, w.user)} style={{ color: '#007ACC' }}>
          {w.user ? w.user.fullName : ''}
          {isOwner && <i className='fa fa-bolt' title='You are the owner of this workspace' />}
        </td>
        <td>{w.modificationDate.toLocaleDateString()}</td>
        <td>{w.views || 0}<i className='fa fa-eye' /></td>
      </tr>
    )
  }

  render () {
    const { items } = this.state

    return (
      <table className={'table ' + style.workspacesTable}>
        <thead>
          <tr>
            <th>name</th>
            <th>user</th>
            <th>modified</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((i) => this.renderItem(i))}
        </tbody>
      </table>
    )
  }
}

export default WorkspacesList
