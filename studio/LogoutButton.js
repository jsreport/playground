import { Component } from 'react'
import Studio from 'jsreport-studio'

export default class LogoutButton extends Component {
  render () {
    return <div onClick={() => this.refs.logout.click()} style={{ cursor: 'pointer' }}>
      <div>
        <form method='POST' action={Studio.resolveUrl('/logout')}>
          <input ref='logout' type='submit' id='logoutBtn' style={{ display: 'none' }} />
        </form>
        <i className='fa fa-power-off' /> Logout
      </div>
    </div>
  }
}
