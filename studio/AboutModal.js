import React, { Component } from 'react'
import PropTypes from 'prop-types'

const logo = 'data:image/png;base64,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'

class AboutModal extends Component {
  render () {
    const { version, extensions } = this.props.options
    const playgroundVersion = extensions.playground.options.version

    return (
      <div>
        <h2>About</h2>
        <div>
          <img src={logo} style={{ width: '100px', height: 'auto', marginBottom: '15px' }} />
        </div>
        <div>
          playground version: <b>{playgroundVersion}</b>
        </div>
        <div>
          jsreport version: <b>{version}</b>
        </div>
        <br />
        <br />
        <div>
          See more information about the playground release in the release notes
        </div>
        <br />
        <div>
          <a
            className='button confirmation'
            href={`https://github.com/jsreport/playground/releases/tag/${playgroundVersion}`}
            target='_blank'
            rel='noreferrer'
            style={{ marginLeft: 0 }}
          >
            Release notes
          </a>
        </div>
      </div>
    )
  }
}

AboutModal.propTypes = {
  options: PropTypes.object.isRequired
}

export default AboutModal
