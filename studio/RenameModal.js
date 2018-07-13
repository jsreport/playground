import React, { Component } from 'react'
import Studio from 'jsreport-studio'

export default class SaveModal extends Component {
  render () {
    return <div>
      <div className='form-group'>
        <label>workspace name</label>
        <input type='text' ref='name' defaultValue={Studio.playground.current.name || ''} />
      </div>
      <div className='form-group'>
        <label>description</label>
        <textarea ref='description' rows='4' defaultValue={Studio.playground.current.description || ''} />
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
            Studio.playground.current.name = this.refs.name.value
            Studio.playground.current.description = this.refs.description.value
            Studio.playground.current.default = this.refs.defaultEntity.value
            if (Studio.playground.current._id) {
              await Studio.playground.save()
            }
            this.props.close()
          }}>save</button>
      </div>
    </div>
  }
}
