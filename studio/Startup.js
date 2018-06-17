import {Component} from 'react'
import Studio from 'jsreport-studio'
import login from './login.js'
import style from './style.scss'
import ReactList from 'react-list'
import debounce from 'lodash.debounce'

export default class Startup extends Component {
  constructor () {
    super()
    this.loading = {
      users: false,
      popular: false,
      examples: false
    }
    this.state = {
      users: { items: [], count: 0, pageNumber: 0 },
      popular: { items: [], count: 0, pageNumber: 0 },
      examples: { items: [], count: 0, pageNumber: 0 },
      search: { items: [] },
      tab: 'popular'
    }

    this.invokeSearch = debounce(this.invokeSearch.bind(this), 500)
  }

  componentWillMount () {
    this.lazyFetch('popular')
    this.lazyFetch('examples')
    this.lazyFetch('users')
  }

  async lazyFetch (type) {
    if (this.loading[type]) {
      return
    }

    let response
    this.loading[type] = true
    try {
      response = await Studio.api.get(`/api/playground/workspaces/${type}/${this.state[type].pageNumber}`)
    } finally {
      this.loading[type] = false
    }
    this.setState({
      [type]: {
        items: this.state[type].items.concat(response.items),
        count: response.count,
        pageNumber: this.state[type].pageNumber + 1
      }
    })

    if (this.state[type].items.length <= this.state[type].pending && response.count) {
      this.lazyFetch(type)
    }
  }

  tryRenderItem (type, index) {
    const w = this.state[type].items[index]
    if (!w) {
      this.state[type].pending = Math.max(this.state[type].pending, index)
      this.lazyFetch(type)
      return <tr key={index}>
        <td><i className='fa fa-spinner fa-spin fa-fw' /></td>
      </tr>
    }

    return this.renderItem(w, index)
  }

  renderItem (w, index) {
    return <tr key={index} onClick={() => Studio.workspaces.open(w)} title={w.description}>
      <td className='selection'>{w.name}</td>
      <td style={{color: '#007ACC'}} onClick={() => alert('here')}>{w.user ? w.user.fullName : ''}</td>
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

  renderPinnedExamples () {
    return <ReactList
      type='uniform' itemsRenderer={this.renderTable} itemRenderer={(index) => this.tryRenderItem('examples', index)}
      length={this.state.examples.count} />
  }

  renderPopularWorkspaces () {
    return <ReactList
      type='uniform' itemsRenderer={this.renderTable} itemRenderer={(index) => this.tryRenderItem('popular', index)}
      length={this.state.popular.count} />
  }

  renderUserWorkspaces () {
    return Studio.workspaces.user ? this.renderForUser() : this.renderForAnonym()
  }

  renderForUser () {
    return <ReactList
      type='uniform' itemsRenderer={this.renderTable} itemRenderer={(index) => this.tryRenderItem('users', index)}
      length={this.state.users.count} />
  }

  renderForAnonym () {
    return <div>
      {login()}
    </div>
  }

  renderActions () {
    return <div>
      <h3>actions</h3>
      <div>
        <button className='button confirmation' onClick={() => Studio.workspaces.create()}>new workspace</button>
        <button className='button confirmation'>search</button>
      </div>
    </div>
  }

  async invokeSearch () {
    const workspaces = await Studio.api.get(`/api/playground/search?q=${encodeURIComponent(this.refs.search.value)}`)
    this.setState({ search: { items: workspaces } })
  }

  renderSearch () {
    return <div>
      <div className={style.searchBox}>
        <label>search for a workspace...</label>
        <input type='text' ref='search' onKeyUp={() => this.invokeSearch()} />
      </div>
      <div>
        <table className={'table ' + style.workspacesTable}>
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
            {this.state.search.items.map((w, i) => this.renderItem(w, i))}
          </tbody>
        </table>
      </div>
    </div>
  }

  renderTab () {
    switch (this.state.tab) {
      case 'examples': return <div>{this.renderPinnedExamples()}</div>
      case 'my': return <div>{this.renderUserWorkspaces()}</div>
      case 'popular': return <div>{this.renderPopularWorkspaces()}</div>
      case 'search': return <div>{this.renderSearch()}</div>
    }
  }

  render () {
    return <div className='custom-editor block'>
      <div>
        {Studio.workspaces.user ? <h2>welcome {Studio.workspaces.user.fullName}</h2> : ''}
      </div>
      <div className={style.newBox}>
        Start by creating a new workspace
        <button className='button confirmation' onClick={() => Studio.workspaces.create()}><i className='fa fa-plus-square' /></button>
      </div>
      <div className={style.tabs}>
        <div className={this.state.tab === 'examples' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'examples' })}>Examples</div>
        <div className={this.state.tab === 'my' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'my' })}>My workspaces</div>
        <div className={this.state.tab === 'popular' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'popular' })}>Popular workspaces</div>
        <div className={this.state.tab === 'search' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'search' })}><i className='fa fa-search' /> Search</div>
      </div>
      <div className='block-item' style={{overflow: 'auto'}}>
        {this.renderTab()}
      </div>
    </div>
  }
}
