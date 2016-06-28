import React, { Component } from 'react'
import Studio from 'jsreport-studio'

export default class ChangeNameModal extends Component {
  static propTypes = {
    close: React.PropTypes.func.isRequired,
    options: React.PropTypes.object.isRequired
  }

  render () {
    return <div>
      <div className='form-group'>
        <label>Workspace name</label>
        <input type='text' ref='name' defaultValue={Studio.workspaces.current.name || ''} />
      </div>
      <div className='button-bar'>
        <button
          className='button confirmation'
          onClick={() => {
            Studio.workspaces.current.name = this.refs.name.value
            Studio.workspaces.save()
            this.props.close()
          }}>ok
        </button>
      </div>
    </div>
  }
}