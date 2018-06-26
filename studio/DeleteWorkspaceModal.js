import React, { Component } from 'react'
import Studio from 'jsreport-studio'

class DeleteWorkspaceModal extends Component {
  componentDidMount () {
    setTimeout(() => this.refs.cancel.focus(), 0)
  }

  remove () {
    const workspace = this.props.options.workspace

    this.props.close()

    Studio.playground.remove(workspace)
  }

  cancel () {
    this.props.close()
  }

  render () {
    const workspace = this.props.options.workspace

    return (
      <div>
        <div>Are you sure you want to delete workspace <b>{workspace.name}</b>?</div>

        <p>
          <small>
            <i>*This action is irreversible and all examples and links to this workspace will stop working</i>
          </small>
        </p>

        <div className='button-bar'>
          <button className='button danger' onClick={() => this.remove()}>Yes</button>
          <button className='button confirmation' ref='cancel' onClick={() => this.cancel()}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default DeleteWorkspaceModal
