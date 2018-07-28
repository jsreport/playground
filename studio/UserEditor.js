import React, {Component} from 'react'
import WorskpacesList from './WorkspacesList'

export default class Startup extends Component {
  render () {
    const { user } = this.props.tab

    return (
      <div className='custom-editor block'>
        <div>
          <h2>{user.fullName}</h2>
        </div>
        <div>
          <WorskpacesList url={`/api/playground/workspaces/user/${user._id}`} />
        </div>
      </div>
    )
  }
}
