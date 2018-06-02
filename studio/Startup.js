import {Component} from 'react'
import Studio from 'jsreport-studio'
import login from './login.js'

export default class Startup extends Component {
  constructor () {
    super()
    this.state = {userWorkspaces: []}
  }

  async expandUsers (workspaces) {
    for (const w of workspaces) {
      const response = await Studio.api.get(`/odata/users('${w.userId}')`)
      if (response.value.length === 1) {
        w.user = response.value[0]
      }
    }
  }

  async componentDidMount () {
    if (Studio.workspaces.user) {
      const response = await Studio.api.get(`/odata/workspaces?$filter=user eq ${Studio.workspaces.user.id}`)
      await this.expandUsers(response.value)
      this.setState({ userWorkspaces: response.value })
    }
  }

  renderPinnedExamples () {
    return <div>
      <h2>pinned examples</h2>
      <div>examples...</div>
    </div>
  }

  renderPopularWorkspaces () {
    return <div>
      <h2>popular workspaces</h2>
      <div>workspaces...</div>
    </div>
  }

  renderUserWorkspaces () {
    return Studio.workspaces.user ? this.renderForUser() : this.renderForAnonym()
  }

  renderForUser () {
    return <div>
      <h2>{Studio.workspaces.user.fullName} workspaces</h2>
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>name</th>
              <th>last modified</th>
            </tr>
          </thead>
          <tbody>
            {this.state.userWorkspaces.map((w) => <tr key={w._id} onClick={() => Studio.workspaces.open(w)}>
              <td className='selection'>{w.name}</td>
              <td>{w.modificationDate.toLocaleString()}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  }

  renderForAnonym () {
    return <div>
      <h2>your workspaces</h2>
      {login()}
    </div>
  }

  renderActions () {
    return <div>
      <h2>actions</h2>
      <div>
        <button className='button confirmation' onClick={() => Studio.workspaces.create()}>new workspace</button>
        <button className='button confirmation'>search</button>
      </div>
    </div>
  }

  render () {
    return <div className='custom-editor' style={{overflow: 'auto', display: 'flex', flexFlow: 'row wrap'}}>
      <div style={{minWidth: '50%', padding: '1rem'}}>{this.renderPinnedExamples()}</div>
      <div style={{minWidth: '50%', padding: '1rem'}}>{this.renderUserWorkspaces()}</div>
      <div style={{minWidth: '50%', padding: '1rem'}}>{this.renderPopularWorkspaces()}</div>
      <div style={{minWidth: '50%', padding: '1rem'}}>{this.renderActions()}</div>
    </div>
  }
}
