const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://localhost:27017'
const database = 'playground3'

async function migrate () {
  const client = await MongoClient.connect(connectionString)
  const db = client.db(database)
  console.log(await db.collection('templates').count())

  console.log('adding user and modificationDate')
  await db.collection('workspaces').updateMany({}, {$set: { userId: 'migration', modificationDate: new Date() }})  
  console.log('recalculating workspace shortid')
  const workspaces = await db.collection('workspaces').find({}).project({ _id: 1, shortid: 1, version: 1 }).toArray()
  const cache = {}
  let wCounter = 1
  for (const w of workspaces) {
    if (wCounter++ % 10000 === 0) {
      console.log(`processing ${wCounter}/${workspaces.length}`)
    }
    cache[`${w.shortid}-${w.version}`] = w._id.toString()
    if (w.shortid.length !== 9) {
      continue
    }
    await db.collection('workspaces').update({_id: w._id}, {$set: {shortid: `${w.shortid}-${w.version}`}})
  }

  const collections = ['assets', 'data', 'scripts', 'templates', 'xlsxTemplates']  

  for (const c of collections) {
    console.log('migrating ' + c)
    const entities = await db.collection(c).find({}).project({_id: 1, workspaceShortid: 1, workspaceVersion: 1}).toArray()
    let eCounter = 0
    for (const e of entities) {
      if (eCounter++ % 10000 === 0) {
        console.log(`processing ${eCounter}/${entities.length}`)
      }
      if (!cache[`${e.workspaceShortid}-${e.workspaceVersion}`]) {
        console.log(`workpsace not in cache for ${e.workspaceShortid}-${e.workspaceVersion}`)
        continue
      }
      await db.collection(c).update({_id: e._id}, { $set: { workspaceId: cache[`${e.workspaceShortid}-${e.workspaceVersion}`] } })
    }
  }

  client.close()
}

migrate().catch(console.error)

/*
1. import
-- workspaces
2. set userId "migration"
3. set modificationDate to currentDate
4. set shortid=shortid+'-'+version
5. cache id associated with new shortid and version
-- entities
5. each collection/entry
6. set workspaceId from cache

// question... is good idea to use workspaceId instead of shortid if it is anyway unique?

additionally all workspaces will get lastViewDate attribute
after some months we will delete those that were not visited
*/

// workspaces migration

// https://playground.jsreport.net/studio/workspace/SyUrRILTg/198

// https://playground.jsreport.net/w/anon/tPTs197

/*
workspace
{
    "_id" : ObjectId("5731c19c514bd9c812a7b87f"),
    "name" : "2. Hello World Phantom Pdf",
    "version" : 2,
    "shortid" : "xykdJcxR5"
}
{
    "_id" : "TLLZzOO_ennHP7vDNyvQq3WEn5RIqN_1",
    "shortid" : "ODOilaf",
    "userId" : "5b5a49366f6d24721f12ffda",
    "name" : "hello",
    "description" : "",
    "default" : "5b5a322290b0141e224f9436",
    "modificationDate" : ISODate("2018-07-26T22:20:38.659Z"),
    "views" : 8
}
*/

/*
entity
{
    "_id" : ObjectId("5731c020514bd9c812a7b847"),
    "content" : "<h1>Hello world with Fibonacci!</h1>\r\n\r\n<p>\r\n    The first example should explain the most basic techniques used in jsreport. \r\n</p>\r\n\r\n<p>\r\n    Assembling reports in jsreport is based on javascript templating engines. \r\n    You define a html template with special tags like this one and jsreport will\r\n    use templating engines rendering and creates report output for you. Output can be html, \r\n    pdf and others will come. This example is rendering simple html, but you will learn \r\n    about other output formats in the next examples.\r\n</p>\r\n\r\n<p>\r\n    In the integrated template designer is the template on the left side. You\r\n    can find a preview of the final report on the right side. Using \"Run\" button\r\n    from the toolbar will invoke post to the jsreport server and displays the\r\n    output in the preview pane. Go ahead and try it!\r\n</p>\r\n\r\n<p>\r\n    Every template can contains javascript helpers. This \r\n    comes from basic concepts of javascript templating engines. The content tab\r\n    contains the report design and the helpers can contain any javascript function\r\n    that can do some computations required in the report. Go ahead and \r\n    switch \"Content\" and \"Helpers\" tabs to see whats there.\r\n</p>\r\n\r\n<p>\r\n    Enought of theory. Following is the very simple example generating 10 items \r\n    from fibonacci sequence and rendering them into html table. It's using helper\r\n    function called fibSequence to get the seqence and basic jsrender tags to render\r\n    a table.\r\n</p>\r\n\r\n<table border=\"1\">  \r\n    <th>n-position</th>\r\n    <th>fib value</th>\r\n   \r\n    <!-- we can call helper functions in jsrender using ~ -->\r\n    {{for ~fibSequence(10)}}\r\n    <tr style=\"background-color:#DD66{{:#data.i}}0\">\r\n        <!-- #data is floating context that is always referencing current item source.  --> \r\n        <td>{{:#data.i}}</td>\r\n        <td>{{:#data.val}}</td>\r\n    </tr>    \r\n    {{/for}}\r\n</table>",
    "engine" : "jsrender",
    "generatedReportsCounter" : null,
    "helpers" : "function fibSequence(size) {\r\n      function fib(n) {\r\n          return (n < 2) ? 1 : (fib(n - 2) + fib(n - 1));\r\n      }\r\n\r\n      var result = [];\r\n      for (var i = 0; i < size; i++) {\r\n          result.push({ i: i, val: fib(i) });\r\n      }\r\n\r\n      return result;\r\n}\r\n",
    "images" : [],
    "isExample" : true,
    "modificationDate" : ISODate("2014-03-09T18:03:17.695Z"),
    "name" : "1. Tutorial - Hello World",
    "phantom" : {
        "margin" : null,
        "header" : null,
        "headerHeight" : null,
        "footer" : null,
        "footerHeight" : null
    },
    "recipe" : "html",
    "shortid" : "x13wJqeRc",
    "workspaceShortid" : "x13wJqeRc",
    "workspaceVersion" : 1
}

{
    "_id" : ObjectId("5b5a4f70eb09f4090de40637"),
    "shortid" : "B1zdkCPNQ",
    "name" : "zzzz",
    "recipe" : "chrome-pdf",
    "engine" : "handlebars",
    "chrome" : {
        "printBackground" : true
    },
    "content" : "zzzz",
    "modificationDate" : ISODate("2018-07-26T22:47:12.330Z"),
    "workspaceId" : "1wyOU~ZNKRmRxngi3jgr1ICtmxCsIlVF"
}
*/
