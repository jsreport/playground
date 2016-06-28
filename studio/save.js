import Studio from 'jsreport-studio'
import _assign from 'lodash/assign'
import Promise from 'bluebird'

export default async () => {
  Studio.startProgress()

  const entities = Studio.getAllEntities()

  if (!Studio.workspaces.current.name) {
    const template = entities.find((e) => e.__entitySet === 'templates')
    if (template) {
      Studio.workspaces.current.name = template.name
    }
  }

  const previousVersion = Studio.workspaces.current.version
  Studio.workspaces.current = await Studio.api.post('/odata/workspaces', {
    data: {
      shortid: Studio.workspaces.current.shortid,
      name: Studio.workspaces.current.name,
      default: Studio.workspaces.current.default
    }
  })

  Studio.setRequestHeader('workspace-shortid', Studio.workspaces.current.shortid)
  Studio.setRequestHeader('workspace-version', Studio.workspaces.current.version)

  await Promise.all(entities.map(async (e) => {
    let post = _assign({}, e)
    if (!e.__isLoaded && !e.__isNew) {
      const loaded = await Studio.api.get(`/odata/${e.__entitySet}?$filter=workspaceVersion eq ${previousVersion} and workspaceShortid eq '${Studio.workspaces.current.shortid}' and shortid eq '${e.shortid}'`)
      post = _assign({}, loaded.value[0], post)
    }

    post = Studio.entities.actions.prune(post)

    post.workspaceShortid = Studio.workspaces.current.shortid
    post.workspaceVersion = Studio.workspaces.current.version
    const oldId = post._id
    delete post._id
    const response = await Studio.api.post(`/odata/${e.__entitySet}`, { data: post })
    post._id = response._id
    post.__entitySet = e.__entitySet
    post.__isLoaded = e.__isLoaded || e.__isNew

    Studio.replaceEntity(oldId, post)
  }))

  Studio.stopProgress()

  return 'block'
}
