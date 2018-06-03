import { Component } from 'react'
import Studio from 'jsreport-studio'

export default class SaveModal extends Component {
  render () {
    return <div>
      <div className='form-group'>
        <label>workspace name</label>
        <input type='text' ref='name' defaultValue={Studio.workspaces.current.name || ''} />
      </div>
      <div className='button-bar'>
        <button
          className='button confirmation'
          onClick={async () => {
            Studio.workspaces.current.name = this.refs.name.value
            if (Studio.workspaces.current._id) {
              await Studio.workspaces.save()
            }
            this.props.close()
          }}>save</button>
      </div>
    </div>
  }
}
