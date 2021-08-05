import React, { Component } from 'react'
import style from './style.scss'

class ShareModal extends Component {
  render () {
    return (
      <div style={{ padding: '1.5rem' }}>
        <h3>simple link</h3>
        <p>
          You can just copy paste browser url to share the playground workspace:
          <br />
          <a href={window.location.href}>{window.location.href}</a>
        </p>
        <h3>embed into website</h3>
        <p>
          If you want embed playground into another page, you can use this html code:
          <br />
          <code className={style.code}>
            &lt;iframe src=&quot;{window.location.href}?embed=1&quot; width=&quot;100%&quot; height=&quot;400&quot; frameborder=&quot;0&quot;&gt;&lt;/iframe&gt;
          </code>
        </p>
      </div>
    )
  }
}

export default ShareModal
