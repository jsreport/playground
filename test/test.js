const jsreport = require('jsreport')
const should = require('should')

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
    }, { __isInitial: true }, 'user')

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
    }, { __isInitial: true }, 'user')

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
    }, { __isInitial: true }, 'user')

    const template = await reporter.documentStore.collection('templates').insert({
      name: 'foo',
      engine: 'none',
      recipe: 'html',
      workspaceId: workspace._id
    })

    await reporter.documentStore.collection('workspaces').update({ _id: workspace._id }, {
      $set: { views: 5, likes: 5, default: template._id }
    })

    workspace = await reporter.documentStore.collection('workspaces').findOne({ _id: workspace._id })

    await reporter.playground.saveWorkspace({
      workspace: {
        name: 'changed',
        default: workspace.default
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
    should(forked.likes).not.be.ok()
    should(forked.views).not.be.ok()
    forked.shortid.should.be.ok()

    const forkedTemplate = await reporter.documentStore.collection('templates').findOne({ workspaceId: forked._id })
    forkedTemplate.name.should.be.eql('foo')
    forkedTemplate.recipe.should.be.eql('html')
    forkedTemplate.content.should.be.eql('content')

    forked.default.should.be.eql(forkedTemplate._id)
  })

  it('addLike and removeLike should increase/decrease likes on workspace', async () => {
    let workspace = await reporter.playground.saveWorkspace({
      workspace: {
        name: 'foo'
      }
    }, { __isInitial: true }, 'user')

    await reporter.playground.addLike(workspace, { _id: 'a' })
    await reporter.playground.addLike(workspace, { _id: 'a' })
    await reporter.playground.addLike(workspace, { _id: 'b' })
    await reporter.playground.removeLike(workspace, { _id: 'c' })
    await reporter.playground.addLike(workspace, { _id: 'd' })
    await reporter.playground.removeLike(workspace, { _id: 'd' })
    workspace = await reporter.playground.findWorkspace({ name: 'foo' })
    workspace.likes.should.be.eql(2)
  })

  it('remove workspace should work', async () => {
    const workspace = await reporter.playground.saveWorkspace({
      workspace: {
        name: 'foo'
      }
    }, { __isInitial: true }, 'user')

    await reporter.playground.addLike(workspace, { _id: 'a' })
    await reporter.playground.addLike(workspace, { _id: 'b' })

    await reporter.playground.removeWorkspace(workspace._id, 'user')

    const w = await reporter.playground.findWorkspace({
      _id: workspace._id
    })

    const likes = await reporter.documentStore.collection('likes').find({
      workspaceId: workspace._id
    })

    should(w == null).be.True()
    should(likes.length).be.eql(0)
  })

  it('findOrInsertUser should find or insert', async () => {
    await reporter.playground.findOrInsertUser({ provider: 'a', externalId: 'b', demo: true })

    const found = await reporter.playground.findOrInsertUser({ provider: 'a', externalId: 'b' })

    // if findOrInsertUser has found the original user it should contain the original demo property
    should(found.demo).be.eql(true)
    should(found.provider).be.eql('a')
    should(found.externalId).be.eql('b')
    should(found._id).be.ok()
  })

  it('insert to collection should add workspaceId', async () => {
    const template = await reporter.documentStore.collection('templates').insert({
      name: 'foo',
      engine: 'none',
      recipe: 'html'
    }, {
      context: {
        workspace: { _id: 'foo' }
      }
    })

    template.workspaceId.should.be.eql('foo')
  })

  it('insert should throw if workspace not set', () => {
    return reporter.documentStore.collection('templates').insert({
      name: 'foo',
      engine: 'none',
      recipe: 'html'
    }, {
      context: {}
    }).should.be.rejected()
  })

  it('update to collection should fill workspaceId', async () => {
    await reporter.documentStore.collection('data').insert({
      name: 'a',
      workspaceId: 'a'
    })

    await reporter.documentStore.collection('data').insert({
      name: 'b',
      workspaceId: 'b'
    })

    await reporter.documentStore.collection('data').update({
      name: 'a'
    }, {
      $set: {
        name: 'c'
      }
    }, {}, {
      context: {
        workspace: { _id: 'a' }
      }
    })

    const items = await reporter.documentStore.collection('data').find({})
    items[0].name.should.be.eql('c')
    items[1].name.should.be.eql('b')
  })

  it('update to collection should throw without workspace', async () => {
    await reporter.documentStore.collection('data').insert({
      name: 'a',
      workspaceId: 'a'
    })

    return reporter.documentStore.collection('data').update({
      name: 'a'
    }, {
      $set: {
        name: 'c'
      }
    }, {}, {
      context: {}
    }).should.be.rejected()
  })

  it('remove to collection should throw without workspace', async () => {
    await reporter.documentStore.collection('data').insert({
      name: 'a',
      workspaceId: 'a'
    })

    return reporter.documentStore.collection('data').remove({
      name: 'a'
    }, {
      context: {}
    }).should.be.rejected()
  })

  it('remove to collection should fill fill current workspaceId', async () => {
    await reporter.documentStore.collection('data').insert({
      name: 'a',
      workspaceId: 'a'
    })

    await reporter.documentStore.collection('data').remove({}, {
      context: {
        workspace: {
          _id: 'b'
        }
      }
    })

    const items = await reporter.documentStore.collection('data').find({})
    items.should.have.length(1)
  })

  it('should throw on workspace query', (done) => {
    reporter.documentStore.collection('workspaces').find({}, {}, {})
      .then(() => done(new Error('should have failed')))
      .catch(() => done())
  })

  it('should throw on users query', (done) => {
    reporter.documentStore.collection('users').find({}, {}, {})
      .then(() => done(new Error('should have failed')))
      .catch(() => done())
  })

  it('listExampleWorkspaces should return pinned workspaces ordered by name', async () => {
    await reporter.documentStore.collection('workspaces').insert({
      name: 'd',
      isPinned: false
    })
    await reporter.documentStore.collection('workspaces').insert({
      name: 'b',
      isPinned: true
    })
    await reporter.documentStore.collection('workspaces').insert({
      name: 'c',
      isPinned: true
    })

    const ws = await reporter.playground.listExampleWorkspaces(0)
    ws.items.should.have.length(2)
    ws.items[0].name.should.be.eql('b')
    ws.items[1].name.should.be.eql('c')
  })

  it('listUserWorkspaces should return user workspaces ordered by modificationDate', async () => {
    await reporter.documentStore.collection('workspaces').insert({
      name: 'a',
      userId: 'a',
      modificationDate: new Date(1000)

    })
    await reporter.documentStore.collection('workspaces').insert({
      name: 'b',
      userId: 'a',
      modificationDate: new Date(2000)
    })
    await reporter.documentStore.collection('workspaces').insert({
      name: 'c',
      userId: 'b'
    })

    const ws = await reporter.playground.listUserWorkspaces('a', 0)
    ws.items.should.have.length(2)
    ws.items[0].name.should.be.eql('b')
    ws.items[1].name.should.be.eql('a')
  })

  it('listPopularWorkspaes should return popular workspaces ordered by number of likes', async () => {
    await reporter.documentStore.collection('workspaces').insert({
      name: 'a',
      likes: 5
    })
    await reporter.documentStore.collection('workspaces').insert({
      name: 'b',
      likes: 10
    })

    const ws = await reporter.playground.listPopularWorkspaces(0)
    ws.items.should.have.length(2)
    ws.items[0].name.should.be.eql('b')
    ws.items[1].name.should.be.eql('a')
  })

  it('listPopularWorkspaces should do paging', async () => {
    await reporter.documentStore.collection('workspaces').insert({
      name: 'a',
      likes: 5
    })
    await reporter.documentStore.collection('workspaces').insert({
      name: 'b',
      likes: 4
    })

    reporter.playground.pageSize = 1
    let ws = await reporter.playground.listPopularWorkspaces(0)
    ws.items.should.have.length(1)
    ws.items[0].name.should.be.eql('a')

    ws = await reporter.playground.listPopularWorkspaces(1)
    ws.items.should.have.length(1)
    ws.items[0].name.should.be.eql('b')
  })

  it('listPopularWorkspaces should expand user', async () => {
    await reporter.documentStore.collection('workspaces').insert({
      name: 'a',
      userId: 'a'
    })
    await reporter.documentStore.collection('users').insert({
      name: 'foo',
      _id: 'a'
    })

    let ws = await reporter.playground.listPopularWorkspaces(0)
    ws.items.should.have.length(1)
    ws.items[0].user.name.should.be.eql('foo')
  })
})