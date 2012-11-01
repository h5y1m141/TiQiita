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

mainWindow = Ti.UI.createWindow
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
mainWindow.add(actInd)

# 投稿一覧情報を取得
mainTable = t.getTable()
rows = []
q.getFeed( (result,links) ->

  for link in links
    if link["rel"] == 'next'
      Ti.App.Properties.setString('nextPageURL',link["url"])
    
  rows.push(t.createRow(json)) for json in result
  rows.push(t.createRowForLoadOldEntry())
  mainTable.setData rows
  actInd.hide()
  mainWindow.add mainTable
  return true
)  

# 自分がチェックしてるタグを取得して、左側にサブメニューとして配置
menuTable = Ti.UI.createTableView
  backgroundColor:'#222'
  zIndex:10
  width:80
  left:0
  top:0
menuRows = []
q.getFollowingTags( (result,links)->
  Ti.API.info result
  for json in result
    row = Ti.UI.createTableViewRow
      width:80
      opacity:0.8
      backgroundColor:'#222'
      borderColor:'#ededed'
      height:30
    textLabel = Ti.UI.createLabel
      width:120
      height:30
      top:0
      left:0
      color:'#fff'
      font:
        fontSize:12
        fontWeight:'bold'
      text:json.url_name
    row.add textLabel
    menuRows.push row
  
  
  menuTable.setData menuRows
  mainWindow.add menuTable
)

btn = Ti.UI.createButton
  systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS

btn.addEventListener('click',(e)->
  mainTable.animate(
    duration:180
    left:150
  )
)
mainWindow.leftNavButton = btn



tabGroup = Ti.UI.createTabGroup()
tab = Ti.UI.createTab
  window: mainWindow
tabGroup.addTab(tab)
tabGroup.open()


