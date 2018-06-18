import {Component} from 'react'
import Studio from 'jsreport-studio'
import login from './login.js'
import style from './style.scss'
import ReactList from 'react-list'
import debounce from 'lodash.debounce'
import WorskpacesList from './WorkspacesList'

export default class Startup extends Component {
  constructor () {
    super()
    this.state = { tab: 'popular' }

    // this.invokeSearch = debounce(this.invokeSearch.bind(this), 500)
  }

  /* componentDidUpdate () {
    if (Studio.playground.startupReloadTrigger) {
      Studio.playground.startupReloadTrigger = false
      this.setState(this.initialState(), () => {
        this.fetchAll()
      })
    }
  } */

  renderPinnedExamples () {
    return <div><WorskpacesList resolveUrl={(pageNumber) => `/api/playground/workspaces/examples?pageNumber=${pageNumber}`}/></div>
  }

  renderPopularWorkspaces () {
    return <div><WorskpacesList resolveUrl={(pageNumber) => `/api/playground/workspaces/popular?pageNumber=${pageNumber}`}/></div>
  }

  renderForUser () {
    return <div><WorskpacesList resolveUrl={(pageNumber) => `/api/playground/workspaces/user/${Studio.playground.user._id}?pageNumber=${pageNumber}`}/></div>
  }

  renderUserWorkspaces () {
    return Studio.playground.user ? this.renderForUser() : this.renderForAnonym()
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
        <button className='button confirmation' onClick={() => Studio.playground.create()}>new workspace</button>
        <button className='button confirmation'>search</button>
      </div>
    </div>
  }

  resolveSearchUrl () {
    return `/api/playground/search?q=${encodeURIComponent(this.refs.search ? this.refs.search.value : '')}`
  }

  renderSearch () {
    return <div>
      <div className={style.searchBox}>
        <label>search for a workspace...</label>
        <input type='text' ref='search' onKeyUp={() => {
          console.log('force update')
          this.refs.searchList.forceUpdate()
        }} />
      </div>
      <div>
        <WorskpacesList ref='searchList' resolveUrl={(pageNumber) => this.resolveSearchUrl()}/>
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
        {Studio.playground.user ? <h2>welcome {Studio.playground.user.fullName}</h2> : ''}
      </div>
      <div className={style.newBox}>
        Start by creating a new workspace
        <button className='button confirmation' onClick={() => Studio.playground.create()}><i className='fa fa-plus-square' /></button>
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
