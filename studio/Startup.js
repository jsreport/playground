import {Component} from 'react'
import Studio from 'jsreport-studio'
import login from './login.js'

export default class Startup extends Component {
  constructor () {
    super()
    this.state = {userWorkspaces: []}
  }

  async componentDidMount () {
    if (Studio.workspaces.user) {
      const response = await Studio.api.get(`/odata/workspaces?$filter=user eq ${Studio.workspaces.user.id}`)
      this.setState({ userWorkspaces: response.value })
    }
  }

  renderForUser () {
    return <div>
      <h2>Hello {Studio.workspaces.user.fullName}</h2>
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
      <h2>login</h2>
      {login()}
      <button className='button confirmation' onClick={() => Studio.openNewModal('templates')}>
        <i className='fa fa-plus' /> Create template
      </button>
    </div>
  }

  render () {
    return <div className='custom-editor' style={{overflow: 'auto'}}>
      {Studio.workspaces.user ? this.renderForUser() : this.renderForAnonym()}
    </div>
  }
}
