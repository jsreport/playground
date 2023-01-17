import React, { Component } from 'react'
import Studio from 'jsreport-studio'

class RenameModal extends Component {
  constructor (props) {
    super(props)
    this.state = { default: Studio.playground.current.default }
    this.nameRef = React.createRef()
    this.descriptionRef = React.createRef()
  }

  change (event) {
    this.setState({ default: event.target.value })
  }

  render () {
    return (
      <div>
        <div className='form-group'>
          <label>workspace name</label>
          <input type='text' ref={this.nameRef} defaultValue={Studio.playground.current.name || ''} />
        </div>
        <div className='form-group'>
          <label>description</label>
          <textarea ref={this.descriptionRef} rows='4' defaultValue={Studio.playground.current.description || ''} />
        </div>
        <div className='form-group'>
          <label>default entity</label>
          <select
            value={this.state.default != null ? this.state.default : ''} onChange={(e) => this.change(e)}
          >
            {[<option key='<default>' value=''>{'<none>'}</option>].concat(Studio.getAllEntities().filter((e) => e.__entitySet !== 'folders').map((e) => (
              <option key={e._id} value={e.shortid}>{e.name + ' (' + e.__entitySet + ')'}</option>
            )))}
          </select>
        </div>
        <div className='button-bar'>
          <button
            className='button confirmation'
            onClick={async () => {
              Studio.playground.current.name = this.nameRef.current.value
              Studio.playground.current.description = this.descriptionRef.current.value
              Studio.playground.current.default = this.state.default

              if (Studio.playground.current._id || Studio.playground.current.__isInitial) {
                await Studio.playground.save()
              }

              this.props.close()
            }}
          >
            save
          </button>
        </div>
      </div>
    )
  }
}

export default RenameModal
