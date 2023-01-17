import React, { Component } from 'react'
import Studio from 'jsreport-studio'

class DeleteAccountModal extends Component {
  constructor (props) {
    super(props)

    this.submitRef = React.createRef()
    this.cancelRef = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => this.cancelRef.current && this.cancelRef.current.focus(), 0)
  }

  delete () {
    this.submitRef.current.click()
  }

  cancel () {
    this.props.close()
  }

  render () {
    const user = this.props.options.user

    return (
      <div>
        <div>Are you sure you want to delete your account <b>{user.username}</b>?</div>

        <p>
          <small>
            <i>*This action is irreversible and all workspaces, examples and links to the workspaces will stop working</i>
          </small>
        </p>

        <form method='POST' action={Studio.resolveUrl('/account/delete')}>
          <input ref={this.submitRef} type='submit' style={{ display: 'none' }} />
        </form>

        <div className='button-bar'>
          <button className='button danger' onClick={() => this.delete()}>Delete account</button>
          <button className='button confirmation' ref={this.cancelRef} onClick={() => this.cancel()}>Cancel</button>
        </div>
      </div>
    )
  }
}

export default DeleteAccountModal
