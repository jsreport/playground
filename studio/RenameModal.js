import { Component } from 'react'
import Studio from 'jsreport-studio'

export default class SaveModal extends Component {
  render () {
    return <div>
      <div className='form-group'>
        <label>workspace name</label>
        <input type='text' ref='name' defaultValue={Studio.workspaces.current.name || ''} />
      </div>
      <div className='form-group'>
        <label>description</label>
        <textarea ref='description' rows='4' defaultValue={Studio.workspaces.current.description || ''} />
      </div>
      <div className='form-group'>
        <label>default entity</label>
        <select ref='defaultEntity'>
          {Studio.getAllEntities().map((e) =>
            <option key={e._id} value={e._id}>{e.name + ' (' + e.__entitySet + ')'}</option>
          )}
        </select>
      </div>
      <div className='button-bar'>
        <button
          className='button confirmation'
          onClick={async () => {
            Studio.workspaces.current.name = this.refs.name.value
            Studio.workspaces.current.description = this.refs.description.value
            Studio.workspaces.current.default = this.refs.defaultEntity.value
            if (Studio.workspaces.current._id) {
              await Studio.workspaces.save()
            }
            this.props.close()
          }}>save</button>
      </div>
    </div>
  }
}
