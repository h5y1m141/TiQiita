Qiita = require('qiita')
tableView = require('tableView')
moment = require('lib/moment.min')
momentja = require('lib/momentja')

t = new tableView()
q = new Qiita()

# クリックイベント時の状態管理のために以下利用
Ti.App.Properties.setBool('stateMainTableSlide',false)


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
  separatorStyle:0
  zIndex:1
  width:80
  left:0
  top:0
  
menuTable.addEventListener('click',(e)->
  
  curretRowIndex = e.index
  
  # すべてのrowの背景色をデフォルト値に設定
  rows = menuTable.data[0].rows
  for row in rows
    if row.backgroundColor isnt '#222'
      row.backgroundColor = '#222'
  
  # その上でクリックされたrowの色を'#59BB0C'に設定
  menuTable.data[0].rows[curretRowIndex].backgroundColor = '#59BB0C'

)
  
menuRows = []
q.getFollowingTags( (result,links)->
  
  for json,i in result
    row = Ti.UI.createTableViewRow
      width:80
      opacity:0.8
      backgroundColor:'#222'
      selectedBackgroundColor:'#59BB0C'
      borderColor:'#ededed'
      height:30
    row.addEventListener('click',(e)->
      
      e.row.backgroundColor = '#59BB0C'
    )
    textLabel = Ti.UI.createLabel
      width:80
      height:30
      top:0
      left:0
      color:'#fff'
      font:
        fontSize:12
        fontWeight:'bold'
      text:json.url_name
    row.add textLabel
    row.rowid = i
    
    menuRows.push row
  
  
  menuTable.setData menuRows
  mainWindow.add menuTable
)

btn = Ti.UI.createButton
  systemButton: Titanium.UI.iPhone.SystemButton.BOOKMARKS

btn.addEventListener('click',(e)->
  
  if Ti.App.Properties.getBool("stateMainTableSlide") is false
    mainTable.animate({
      duration:200,
      left:80
    },()-> Ti.App.Properties.setBool("stateMainTableSlide",true))

  else
    mainTable.animate({
      duration:200
      left:0
    }, ()-> Ti.App.Properties.setBool("stateMainTableSlide",false))
    
)
mainWindow.leftNavButton = btn



tabGroup = Ti.UI.createTabGroup()
tab = Ti.UI.createTab
  window: mainWindow
tabGroup.addTab(tab)
tabGroup.open()
