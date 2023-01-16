import React, { Component } from 'react'

const isMac = () => window.navigator.platform.toUpperCase().indexOf('MAC') >= 0

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
    if (
      // ctrl + s
      (e.ctrlKey && e.which === 83) ||
      // handles CMD + S on Mac
      (isMac() && e.metaKey && e.which === 83)
    ) {
      e.preventDefault()

      if (this.props.save) {
        this.props.save()
        return false
      }
    }
  }

  render () {
    const { save, canEdit, enabled } = this.props

    return (
      <div
        className={'toolbar-button ' + (!enabled && canEdit ? 'disabled' : '')} onClick={() => save()}
      >
        {canEdit
          ? <span title='Save workspace (CTRL+S)'><i className='fa fa-floppy-o' /> Save</span>
          : <span title='Fork workspace'><i className='fa fa-clone' /> Fork</span>}
      </div>
    )
  }
}

export default ToolbarSaveForkButton
