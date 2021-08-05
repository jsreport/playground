import React, { Component } from 'react'
import Studio from 'jsreport-studio'
import login from './login.js'
import style from './style.scss'
import debounce from 'lodash.debounce'
import DeleteWorkspaceModal from './DeleteWorkspaceModal'
import WorskpacesList from './WorkspacesList'

class Startup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tab: Studio.playground.user ? 'my' : 'examples',
      searchTerm: ''
    }

    this.handleSearchChange = debounce(this.handleSearchChange.bind(this), 500)

    this.examplesRef = React.createRef()
    this.popularRef = React.createRef()
    this.myRef = React.createRef()
    this.searchRef = React.createRef()
  }

  handleSearchChange () {
    this.reloadTab(this.state.tab)
  }

  handleRemove (w) {
    Studio.openModal(DeleteWorkspaceModal, {
      workspace: w
    })
  }

  onTabActive () {
    this.reloadTab(this.state.tab)
  }

  componentDidMount () {
    Studio.playground.startupReload = () => {
      this.reloadTab(this.state.tab)
    }

    this.reloadTab(this.state.tab)
  }

  componentWillUnmount () {
    Studio.playground.startupReload = null
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.tab !== this.state.tab) {
      this.reloadTab(this.state.tab)
    }
  }

  reloadTab (tab) {
    const ref = this[`${tab}Ref`]

    if (ref && ref.current) {
      ref.current.onTabActive()
    }
  }

  renderPinnedExamples () {
    return (
      <div>
        <WorskpacesList
          ref={this.examplesRef}
          key='examples'
          url='/api/playground/workspaces/examples'
          onRemove={this.handleRemove}
        />
      </div>
    )
  }

  renderPopularWorkspaces () {
    return (
      <div>
        <WorskpacesList
          ref={this.popularRef}
          key='popular'
          url='/api/playground/workspaces/popular'
          onRemove={this.handleRemove}
        />
      </div>
    )
  }

  renderUserWorkspaces () {
    return Studio.playground.user ? this.renderForUser() : this.renderForAnonym()
  }

  renderForUser () {
    return (
      <div>
        <WorskpacesList
          ref={this.myRef}
          key='my'
          url={`/api/playground/workspaces/user/${Studio.playground.user._id}`}
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
    return (
      <div>
        <h3>actions</h3>
        <div>
          <button className='button confirmation' onClick={() => Studio.playground.create()}>new workspace</button>
          <button className='button confirmation'>search</button>
        </div>
      </div>
    )
  }

  renderSearch () {
    const { searchTerm } = this.state

    return (
      <div>
        <div className={style.searchBox}>
          <label>search for a workspace...</label>
          <input
            type='text'
            value={searchTerm}
            onChange={(ev) => this.setState({ searchTerm: ev.target.value })}
            onKeyUp={this.handleSearchChange}
          />
        </div>
        <div>
          <WorskpacesList
            ref={this.searchRef}
            url={`/api/playground/search?q=${encodeURIComponent(searchTerm != null ? searchTerm : '')}`}
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
    return (
      <div className='custom-editor block'>
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
        <div className={style.tabs}>
          <div className={this.state.tab === 'examples' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'examples' })}>Examples</div>
          <div className={this.state.tab === 'my' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'my' })}>My workspaces</div>
          <div className={this.state.tab === 'popular' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'popular' })}>Popular workspaces</div>
          <div className={this.state.tab === 'search' ? style.selectedTab : ''} onClick={() => this.setState({ tab: 'search' })}><i className='fa fa-search' /> Search</div>
        </div>
        <div className='block-item' style={{ overflow: 'auto' }}>
          {this.renderTab()}
        </div>
      </div>
    )
  }
}

export default Startup
