import React, { Component } from 'react'

export default class ShareModal extends Component {
  render () {
    return (
      <div style={{padding: '1.5rem'}}>
        <p>
          <b><i className='fa fa-code' />&nbsp;Use the following code to embed your workspace in another page:</b>
        </p>
        <br />
        <code style={{ backgroundColor: 'wheat' }}>
          &lt;iframe src=&quot;{window.location.href}?embed=1&quot; width=&quot;100%&quot; height=&quot;400&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;
        </code>
      </div>
    )
  }
}
