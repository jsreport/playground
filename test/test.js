const jsreport = require('jsreport')
require('should')

describe('playground', () => {
  let reporter

  beforeEach(() => {
    reporter = jsreport({
      store: {
        provider: 'memory'
      },
      extensions: {
        express: {
          enabled: false
        }
      }
    })
    return reporter.init()
  })

  afterEach(() => reporter.close())

  it('saveWorkspace should insert new one when no currentWorkspace passed', async () => {
    await reporter.playground.saveWorkspace({
      workspace: {
        name: 'foo'
      }
    }, null, 'user')

    const workspace = await reporter.playground.findWorkspace({ name: 'foo' })
    workspace._id.should.be.ok()
    workspace.shortid.should.be.ok()
    workspace.userId.should.be.eql('user')
    workspace.name.should.be.eql('foo')
  })

  it('saveWorkspace with currentWorkspace set and user matches should update', async () => {
    let workspace = await reporter.playground.saveWorkspace({
      workspace: {
        name: 'foo'
      }
    }, null, 'user')

    await reporter.playground.saveWorkspace({
      workspace: {
        name: 'changed'
      }
    }, workspace, 'user')

    workspace = await reporter.playground.findWorkspace({ name: 'changed' })
    workspace.should.be.ok()
  })

  it('saveWorkspace with currentWorkspace set and user different should fork', async () => {
    let workspace = await reporter.playground.saveWorkspace({
      workspace: {
        name: 'foo'
      }
    }, null, 'user')

    const template = await reporter.documentStore.collection('templates').insert({
      name: 'foo',
      engine: 'none',
      recipe: 'html',
      workspaceId: workspace._id
    })

    await reporter.playground.saveWorkspace({
      workspace: {
        name: 'changed'
      },
      entities: [{
        _id: template._id,
        content: 'content',
        engine: 'none',
        recipe: 'html'
      }]
    }, workspace, 'user2')

    const forked = await reporter.playground.findWorkspace({ name: 'changed' })
    forked.should.be.ok()
    forked._id.should.not.be.eql(workspace._id)
    forked.shortid.should.be.ok()

    const forkedTemplate = await reporter.documentStore.collection('templates').findOne({ workspaceId: forked._id })
    forkedTemplate.name.should.be.eql('foo')
    forkedTemplate.recipe.should.be.eql('html')
    forkedTemplate.content.should.be.eql('content')
  })

  it('addLike and removeLike should increase/decrease likes on workspace', async () => {
    let workspace = await reporter.playground.saveWorkspace({
      workspace: {
        name: 'foo'
      }
    }, null, 'user')

    await reporter.playground.addLike(workspace, { _id: 'a' })
    await reporter.playground.addLike(workspace, { _id: 'a' })
    await reporter.playground.addLike(workspace, { _id: 'b' })
    await reporter.playground.removeLike(workspace, { _id: 'c' })
    await reporter.playground.addLike(workspace, { _id: 'd' })
    await reporter.playground.removeLike(workspace, { _id: 'd' })
    workspace = await reporter.playground.findWorkspace({ name: 'foo' })
    workspace.likes.should.be.eql(2)
  })

  it('findOrInsertUser should find or insert', async () => {
    await reporter.playground.findOrInsertUser({ provider: 'a', externalId: 'b' })
    const found = await reporter.playground.findOrInsertUser({ provider: 'a', externalId: 'b' })
    found.provider.should.be.eql('a')
    found.externalId.should.be.eql('b')
    found._id.should.be.ok()
  })
})
