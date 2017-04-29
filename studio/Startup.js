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
          <td className='selection'><a href='/studio/workspace/SyUrRILTg/198' target='_blank'>Invoice pdf</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/SkDFywLpe/3' target='_blank'>Orders with data fetch script</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/ry0peD8pl/9' target='_blank'>Population Excel</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/HkqlE-Ww/318' target='_blank'>Live dashboard</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Y3BG0fnPa/1201' target='_blank'>Html table to Excel</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/gkxJuycgR5/1' target='_blank'>Pdf rendering with Apache FOP</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/ZJZMyHgm2e/204' target='_blank'>Chrome based pdf rendering using electron</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/bkBXJqNOae/119' target='_blank'>wkhtmltopdf with page numbers</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Y3QQDfP9a/34' target='_blank'>csv</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/HkM7PSFSl/15' target='_blank'>Template layouts</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/HyGQQ-KHl/28' target='_blank'>Custom font in pdf</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/gyHJRWnpn/79' target='_blank'>Pdf page breaks</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/r1vaurbw/3' target='_blank'>Add row to Excel</a>
          </td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/ryaUvq21e/3' target='_blank'>Excel debug</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Hkr4xanxg/145' target='_blank'>Update excel cell</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/rkWcRiHog/128' target='_blank'>Dynamic formula in excel</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/BkcNMahxg/6' target='_blank'>Auto recalculate excel formulas</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/Hy_V2BSh/4' target='_blank'>Excel table</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/SyL6aErP/2' target='_blank'>Add sheet to excel</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/rkX89bHD/2' target='_blank'>Merged excel cells</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/H1BHqBZw/9' target='_blank'>Conditional excel formatting</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/BJa5OBWD/2' target='_blank'>Rename excel sheet</a></td>
        </tr>
        <tr>
          <td className='selection'><a href='/studio/workspace/HyQH-eKv/115' target='_blank'>Excel pivot table</a></td>
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
      <button className='button confirmation' onClick={() => this.refs.lastCreatedWorkspaces.scrollIntoView()}>
        <i className='fa fa-user' /> Last created workspaces
      </button>
      <h2>playground samples</h2>
      {this.renderExamples()}
      <h2 ref='lastCreatedWorkspaces'>last created workspaces</h2>
      {this.renderLastCreated()}
    </div>
  }
}
