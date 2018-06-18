import {Component} from 'react'
import Studio from 'jsreport-studio'
import style from './style.scss'
import ReactList from 'react-list'

export default class WorkspacesList extends Component {
  constructor () {
    super()
    this.loading = false
    this.state = this.initialState()
  }

  initialState () {
    return { items: [], count: 0, pageNumber: 0 }
  }

  componentWillMount () {
    this.lazyFetch()
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
      return <tr key={index}>
        <td><i className='fa fa-spinner fa-spin fa-fw' /></td>
      </tr>
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

  renderItem (w, index) {
    return <tr key={index} onClick={() => Studio.playground.open(w)} title={w.description}>
      <td className='selection'>{w.name}</td>
      <td onClick={(e) => this.openUser(e, w.user)} style={{color: '#007ACC'}}>{w.user ? w.user.fullName : ''}</td>
      <td>{w.modificationDate.toLocaleDateString()}</td>
      <td>{w.views || 0}<i className='fa fa-eye' /></td>
      <td>{w.likes || 0}<i className='fa fa-heart' /></td>
    </tr>
  }

  renderTable (items, ref) {
    return <table className={'table ' + style.workspacesTable} ref={ref}>
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
  }

  render () {
    return <ReactList
      type='uniform' itemsRenderer={this.renderTable} itemRenderer={(index) => this.tryRenderItem(index)}
      length={this.state.count} />
  }
}
