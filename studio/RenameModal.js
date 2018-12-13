import React, { Component } from 'react'
import Studio from 'jsreport-studio'

export default class RenameModal extends Component {
  constructor (props) {
    super(props)
    this.state = { default: Studio.playground.current.default }
  }

  change (event) {
    this.setState({ default: event.target.value })
  }

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
        <select ref='defaultEntity' value={this.state.default} onChange={(e) => this.change(e)}>
          {Studio.getAllEntities().filter((e) => e.__entitySet !== 'folders').map((e) => (
            <option key={e._id} value={e.shortid}>{e.name + ' (' + e.__entitySet + ')'}</option>
          ))}
        </select>
      </div>
      <div className='button-bar'>
        <button
          className='button confirmation'
          onClick={async () => {
            Studio.playground.current.name = this.refs.name.value
            Studio.playground.current.description = this.refs.description.value
            Studio.playground.current.default = this.state.default

            if (Studio.playground.current._id) {
              await Studio.playground.save()
            }

            this.props.close()
          }}>save</button>
      </div>
    </div>
  }
}
