import React, {Component} from 'react'
import shortid from 'shortid'
import Studio from 'jsreport-studio'
import login from './login.js'
import style from './style.scss'
// import debounce from 'lodash.debounce'
import DeleteWorkspaceModal from './DeleteWorkspaceModal'
import WorskpacesList from './WorkspacesList'

export default class Startup extends Component {
  constructor () {
    super()
    this.state = { tab: 'popular' }

    // this.invokeSearch = debounce(this.invokeSearch.bind(this), 500)
  }

  componentWillMount () {
    if (Studio.playground.startupReloadTrigger) {
      Studio.playground.startupReloadTrigger = false
    }

    this.refresh()
  }

  componentDidUpdate () {
    if (Studio.playground.startupReloadTrigger) {
      Studio.playground.startupReloadTrigger = false

      this.refresh()
    }
  }

  refresh () {
    this.setState({
      refreshKey: shortid.generate()
    })
  }

  handleRemove (w) {
    Studio.openModal(DeleteWorkspaceModal, {
      workspace: w
    })
  }

  renderPinnedExamples () {
    const { refreshKey } = this.state

    return (
      <div>
        <WorskpacesList
          key={refreshKey}
          resolveUrl={(pageNumber) => `/api/playground/workspaces/examples?pageNumber=${pageNumber}`}
          onRemove={this.handleRemove}
        />
      </div>
    )
  }

  renderPopularWorkspaces () {
    const { refreshKey } = this.state

    return (
      <div>
        <WorskpacesList
          key={refreshKey}
          resolveUrl={(pageNumber) => `/api/playground/workspaces/popular?pageNumber=${pageNumber}`}
          onRemove={this.handleRemove}
        />
      </div>
    )
  }

  renderUserWorkspaces () {
    return Studio.playground.user ? this.renderForUser() : this.renderForAnonym()
  }

  renderForUser () {
    const { refreshKey } = this.state

    return (
      <div>
        <WorskpacesList
          key={refreshKey}
          resolveUrl={(pageNumber) => `/api/playground/workspaces/user/${Studio.playground.user._id}?pageNumber=${pageNumber}`}
          onRemove={this.handleRemove}
        />
      </div>
    )
  }

  renderForAnonym () {
    return (
      <div>
        {login()}
      </div>
    )
  }

  renderActions () {
    return <div>
      <h3>actions</h3>
      <div>
        <button className='button confirmation' onClick={() => Studio.playground.create()}>new workspace</button>
        <button className='button confirmation'>search</button>
      </div>
    </div>
  }

  resolveSearchUrl () {
    return `/api/playground/search?q=${encodeURIComponent(this.refs.search ? this.refs.search.value : '')}`
  }

  renderSearch () {
    const { refreshKey } = this.state

    return (
      <div>
        <div className={style.searchBox}>
          <label>search for a workspace...</label>
          <input type='text' ref='search' onKeyUp={() => {
            console.log('force update')
            this.refs.searchList.forceUpdate()
          }} />
        </div>
        <div>
          <WorskpacesList
            key={refreshKey}
            ref='searchList'
            resolveUrl={(pageNumber) => this.resolveSearchUrl()}
            editable={false}
          />
        </div>
      </div>
    )
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
        {Studio.playground.user ? <h2>welcome <b>{Studio.playground.user.fullName}</b></h2> : ''}
      </div>
      <div className={style.newBox}>
        Start by creating a new workspace
        <button
          className='button confirmation'
          onClick={() => Studio.playground.create()}
          title='create template in new workspace'
        >
          <i className='fa fa-plus-square' />
        </button>
      </div>
      <div>
        <buton
          className='button confirmation'
          style={{ display: 'inline-block', marginLeft: 0, marginBottom: '1rem' }}
          onClick={() => this.refresh()}
        >
          <i className='fa fa-refresh' /> Refresh
        </buton>
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
