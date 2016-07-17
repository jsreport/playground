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
            <a href='/studio/workspace/HJVhE0QP/5' target='_blank'>Hello world</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/lkHFBn0xB/722' target='_blank'>Example Pdf Report</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a
            href='/studio/workspace/HkqlE-Ww/17' target='_blank'>Live dashboard</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/l1DbOPsN5/1196' target='_blank'>Pdf Invoice</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/r1G-1ULP/3' target='_blank'>Server script loading report data</a></td>
        </tr>
        <tr>
          <td className='selection'><a
            href='/studio/workspace/r1vaurbw/3' target='_blank'>Add row to Excel</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/HyQH-eKv/6' target='_blank'>Excel pivot table</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/gkxJuycgR5/1' target='_blank'>Apache FOP</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Y3BG0fnPa/1' target='_blank'>Html to xlsx</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Y3QQDfP9a/34' target='_blank'>csv</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/bkBXJqNOae/14' target='_blank'>wkhtmltopdf page numbers</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/ZJZMyHgm2e/2' target='_blank'>electron pdf</a></td>
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
      <h2>playground samples</h2>
      {this.renderExamples()}
    </div>
  }
}