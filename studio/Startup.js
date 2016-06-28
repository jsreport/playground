import React, {Component} from 'react'
import Studio from 'jsreport-studio'

export default class Startup extends Component {

  constructor () {
    super()
    this.state = {}
  }

  async componentDidMount () {
    const response = await Studio.api.get('/odata/workspaces?$orderby=creationDate desc&$top=10')

    this.setState({ lastCreated: response.value })
  }

  renderExamples () {
    return <table className='table'>
      <tbody>
        <tr>
          <td className='selection'>
            <a href='/studio/workspace/x13wJqeRc/1' target='_blank'>1. Tutorial - Hello World</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/xykdJcxR5/1' target='_blank'>2. Tutorial - Recipes</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a
            href='/studio/workspace/lyl_15eC9/1' target='_blank'>3. Tutorial - Data extension</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a
            href='/studio/workspace/lyWJuycgAc/1' target='_blank'>4. Tutorial - Scripts extension</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/lkHFBn0xB/1' target='_blank'>Complex Pdf</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/YBjmBsPFa/1' target='_blank'>Excel</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/gkxJuycgR5/1' target='_blank'>FOP</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Y3BG0fnPa/1' target='_blank'>Html to xlsx</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/l1DbOPsN5/1' target='_blank'>Pdf Invoice</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Y3QQDfP9a/1' target='_blank'>csv</a></td>
        </tr>
      </tbody>
    </table>
  }

  open (w) {
    window.open(`/studio/workspace/${w.shortid}/${w.version}`, '_blank')
  }

  renderLastCreated () {
    return <table className='table'>
      <thead>
        <tr>
          <th>name</th>
          <th>version</th>
        </tr>
      </thead>
      <tbody>
        {(this.state.lastCreated || []).map(
          (w) => <tr key={w._id} onClick={() => this.open(w)}>
            <td className='selection'>{w.name || 'Anonymous'}</td>
            <td>{w.version}</td>
          </tr>
        )}
      </tbody>
    </table>
  }

  render () {
    return <div className='custom-editor' style={{overflow: 'auto'}}>
      <h2>quick start</h2>
      <button className='button confirmation' onClick={() => Studio.openNewModal('templates')}>
        <i className='fa fa-plus' /> Create template
      </button>
      <h2>last created workspaces</h2>
      {this.renderLastCreated()}
      <h2>playground tutorials</h2>
      {this.renderExamples()}
    </div>
  }
}