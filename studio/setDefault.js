import Studio from 'jsreport-studio'
export default () => {
  if (Studio.workspaces.current.default === Studio.getActiveEntity().shortid) {
    Studio.workspaces.current.default = undefined
  } else {
    Studio.workspaces.current.default = Studio.getActiveEntity().shortid
  }
  Studio.workspaces.save()
}