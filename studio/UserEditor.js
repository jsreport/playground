import React, { Component } from 'react'
import WorskpacesList from './WorkspacesList'

class UserEditor extends Component {
  constructor (props) {
    super(props)

    this.workspacesRef = React.createRef()
  }

  reloadTab () {
    if (this.workspacesRef.current) {
      this.workspacesRef.current.onTabActive()
    }
  }

  onTabActive () {
    this.reloadTab()
  }

  render () {
    const { user } = this.props.tab

    return (
      <div className='custom-editor block'>
        <div>
          <h2>{user.fullName}</h2>
        </div>
        <div>
          <WorskpacesList ref={this.workspacesRef} url={`/api/playground/workspaces/user/${user._id}`} />
        </div>
      </div>
    )
  }
}

export default UserEditor
