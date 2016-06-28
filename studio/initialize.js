import Studio from 'jsreport-studio'
import shortid from 'shortid'

const workspaceRegex = /\/studio\/workspace\/([^\/]+)\/([^\/]+)/
const playgroundRegex = /[\/]?playground\/([^\/]+)[\/]?([^\/]+)?/

export default async () => {
  const match = workspaceRegex.exec(window.location.pathname)

  if (match) {
    const response = await Studio.api.get(`/odata/workspaces?$filter=shortid eq '${match[1]}' and version eq ${parseInt(match[2])}`)

    Studio.workspaces.current = response.value.length ? response.value[0] : {
      shortid: match[1],
      version: parseInt(match[2])
    }
  } else {
    const oldMatch = playgroundRegex.exec(window.location.hash)

    if (oldMatch) {
      window.location = `/studio/workspace/${oldMatch[1]}` + (oldMatch[2] ? `/${oldMatch[2]}` : '/1')
    }

    Studio.workspaces.current.shortid = shortid.generate()
    Studio.workspaces.current.version = 1
    Studio.updateHistory()
  }

  Studio.setRequestHeader('workspace-shortid', Studio.workspaces.current.shortid)
  Studio.setRequestHeader('workspace-version', Studio.workspaces.current.version)
}