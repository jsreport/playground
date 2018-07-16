import React, { Component } from 'react'

class ToolbarSaveForkButton extends Component {
  constructor (props) {
    super(props)
    this.handleShortcut = this.handleShortcut.bind(this)
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleShortcut)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleShortcut)
  }

  handleShortcut (e) {
    // ctrl + s
    if (e.ctrlKey && e.which === 83) {
      e.preventDefault()

      if (this.props.save) {
        this.props.save()
        return false
      }
    }
  }

  render () {
    const { save, canEdit } = this.props

    return (
      <div
        className='toolbar-button' onClick={() => save()}>
        {canEdit
          ? <span title='Save workspace (CTRL+S)'><i className='fa fa-floppy-o' /> Save</span>
          : <span title='Fork workspace'><i className='fa fa-clone' /> Fork</span>}
      </div>
    )
  }
}

export default ToolbarSaveForkButton
