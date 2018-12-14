import React, { Component } from 'react'
import WorskpacesList from './WorkspacesList'

export default class UserEditor extends Component {
  reloadTab () {
    if (this.refs.workspaces) {
      this.refs.workspaces.onTabActive()
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
          <WorskpacesList ref='workspaces' url={`/api/playground/workspaces/user/${user._id}`} />
        </div>
      </div>
    )
  }
}
