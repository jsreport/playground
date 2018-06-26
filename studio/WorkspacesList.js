import React, {Component} from 'react'
import Studio from 'jsreport-studio'
import style from './style.scss'
import ReactList from 'react-list'

export default class WorkspacesList extends Component {
  constructor () {
    super()
    this.loading = false
    this.state = this.initialState()
    this.tryHide = this.tryHide.bind(this)
  }

  initialState () {
    return { items: [], count: 0, pageNumber: 0 }
  }

  componentWillMount () {
    this.lazyFetch()
  }

  componentDidMount () {
    window.addEventListener('click', this.tryHide)
  }

  componentWillUnmount () {
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

  async lazyFetch () {
    if (this.loading) {
      return
    }

    let response
    this.loading = true
    try {
      response = await Studio.api.get(this.props.resolveUrl(this.state.pageNumber))
    } finally {
      this.loading = false
    }
    this.setState({
      items: this.state.items.concat(response.items),
      count: response.count,
      pageNumber: this.state.pageNumber + 1
    })

    if (this.state.items.length <= this.state.pending && response.count) {
      this.lazyFetch()
    }
  }

  tryRenderItem (index) {
    const w = this.state.items[index]

    if (!w) {
      this.state.pending = Math.max(this.state.pending, index)
      this.lazyFetch()

      return (
        <tr key={index}>
          <td><i className='fa fa-spinner fa-spin fa-fw' /></td>
        </tr>
      )
    }

    return this.renderItem(w, index)
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

  renderItem (w, index) {
    const { contextMenuId } = this.state
    const { editable } = this.props

    return (
      <tr
        key={w._id}
        onClick={() => contextMenuId == null && Studio.playground.open(w)}
        onContextMenu={(e) => this.contextMenu(e, w)}
        title={w.description}
      >
        <td className='selection'>
          {w.name}
          {editable !== false && contextMenuId === w._id ? this.renderContextMenu(w) : null}
        </td>
        <td onClick={(e) => contextMenuId == null && this.openUser(e, w.user)} style={{color: '#007ACC'}}>{w.user ? w.user.fullName : ''}</td>
        <td>{w.modificationDate.toLocaleDateString()}</td>
        <td>{w.views || 0}<i className='fa fa-eye' /></td>
        <td>{w.likes || 0}<i className='fa fa-heart' /></td>
      </tr>
    )
  }

  renderTable (items, ref) {
    return (
      <table className={'table ' + style.workspacesTable} ref={ref}>
        <thead>
          <tr>
            <th>name</th>
            <th>user</th>
            <th>modified</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    )
  }

  render () {
    return (
      <ReactList
        type='uniform'
        itemsRenderer={this.renderTable}
        itemRenderer={(index) => this.tryRenderItem(index)}
        length={this.state.count}
      />
    )
  }
}
