import React, { Component } from 'react'

export default class ShareModal extends Component {
  static propTypes = {
    close: React.PropTypes.func.isRequired,
    options: React.PropTypes.object.isRequired
  }

  render () {
    return <div style={{padding: '3rem'}}>
      <code>
        &lt;iframe src='{window.location.href}?embed=1' width=&quot;100%&quot; height=&quot;400&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;
      </code>
    </div>
  }
}