import { Component } from 'react'
import login from './login.js'
import Studio from 'jsreport-studio'

export default class SaveModal extends Component {
  async save (href) {
    await Studio.workspaces.save()
    this.props.close()

    if (href) {
      window.location.href = href
    }
  }

  render () {
    return <div>
      <h3>save to your account</h3>
      <p>You will be able to come back anytime and find it.</p>
      <div>
        {login({ onClick: (href) => this.save(href) })}
      </div>
      <h3 style={{marginTop: '2rem'}}>save as anonym</h3>
      <p>Not so cool but quick</p>
      <div>
        <button className='button confirmation' style={{float: 'left', marginLeft: 0}} onClick={() => this.save()}>
          <i className='fa fa-floppy' /> Save as anonym
        </button>
      </div>
    </div>
  }
}
