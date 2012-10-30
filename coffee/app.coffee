Qiita = require('qiita')
tableView = require('tableView')
moment = require('lib/moment.min')
momentja = require('lib/momentja')

t = new tableView()
q = new Qiita()


token = Ti.App.Properties.getString('QiitaToken')
if token is null
  q._auth()
Ti.API.info('Token is' + token)

win1 = Ti.UI.createWindow
  title:'Qiita'
  barColor:'#59BB0C'

actInd = Ti.UI.createActivityIndicator
  zIndex:10
  top:100
  left: 120
  height: 40
  width: 'auto'
  font: 
    fontFamily:'Helvetica Neue'
    fontSize:15
    fontWeight:'bold'
  color: '#fff'
  message: 'loading...'
actInd.show()
win1.add(actInd)

mainTable = t.getTable()

rows = []
q.getFeed( (result,links) ->
  for link in links
    if link["rel"] == 'next'
      Ti.App.Properties.setString('nextPageURL',link["url"])
    
  rows.push(t.createRow(json)) for json in result
  rows.push(t.createRowForLoadOldEntry())
  mainTable.setData(rows)
  actInd.hide()
  win1.add(mainTable)
  return true
)  




tg = Ti.UI.createTabGroup()
tab = Ti.UI.createTab
  window: win1
tg.addTab(tab)
tg.open()


