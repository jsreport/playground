import React, { Component } from 'react'
import Studio from 'jsreport-studio'

class LogoutButton extends Component {
  constructor (props) {
    super(props)

    this.logoutRef = React.createRef()
  }

  render () {
    return (
      <div onClick={() => this.logoutRef.current.click()} style={{ cursor: 'pointer' }}>
        <div>
          <form method='POST' action={Studio.resolveUrl('/logout')}>
            <input ref={this.logoutRef} type='submit' id='logoutBtn' style={{ display: 'none' }} />
          </form>
          <i className='fa fa-power-off' /> Logout
        </div>
      </div>
    )
  }
}

export default LogoutButton
